/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { Coin } from "../../types";
import { getPriceChangePercentage } from "../../util";

import {
  getCoinMarketFailed,
  getCoinMarketRequested,
  GetCoinMarketRequestedAction,
  getCoinMarketSucceeded,
  getHoldingsFailed,
  getHoldingsRequested,
  GetHoldingsRequestedAction,
  getHoldingsSucceeded,
  getSparklineFailed,
  getSparklineRequested,
  GetSparklineRequestedAction,
  getSparklineSucceeded,
  PriceChangePerc,
  refreshHomeScreenRequested,
  RefreshHomeScreenRequestedAction,
  refreshHomeScreenSucceeded,
} from "./slice";

export interface ResponseGenerator {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
}

export function* getHoldingsSaga(action: GetHoldingsRequestedAction) {
  const {
    holdings,
    currency = "usd",
    orderBy = "market_cap_desc",
    sparkline = false,
    priceChangePerc = "7d",
    perPage = 50,
    page = 1,
  } = action.payload;

  const ids = holdings?.map((item) => item?.id).join(",");
  const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}&ids=${ids}`;
  try {
    const response: ResponseGenerator = yield call([axios, axios.get], apiUrl);

    const mappedHoldings = response.data.map((item: any) => {
      const coin = holdings?.find((a) => a.id === item?.id);
      const price7d = item.current_price / (1 + item.price_change_percentage_7d_in_currency * 0.01);
      return {
        id: item?.id,
        symbol: item?.symbol,
        name: item?.name,
        image: item?.image,
        currentPrice: item?.current_price,
        qty: coin.qty,
        total: coin.qty * item?.current_price,
        priceChangePercentageInCurrency7d: item?.price_change_percentage_7d_in_currency,
        holdingValueChange7d: (item?.current_price - price7d) * coin.qty,
        sparklineIn7d: {
          value: item?.sparkline_in_7d?.price?.map((price: number) => price * coin.qty),
        },
      };
    });
    yield put(getHoldingsSucceeded({ holdings: mappedHoldings }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getHoldingsFailed({ error }));
  }
}

export function* getCoinMarketSaga(action: GetCoinMarketRequestedAction) {
  const {
    currency = "usd",
    orderBy = "market_cap_desc",
    sparkline = false,
    priceChangePerc = PriceChangePerc.oneWeek,
    perPage = 50,
    page = 1,
  } = action.payload;

  const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}`;

  try {
    const response: ResponseGenerator = yield call([axios, axios.get], apiUrl);
    const coins = response.data as Coin[];
    const mappedCoins = coins.map((coin) => {
      return {
        ...coin,
        priceChangePercentageInCurrency: getPriceChangePercentage(coin, priceChangePerc),
      };
    });
    yield put(getCoinMarketSucceeded({ coins: mappedCoins }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getCoinMarketFailed({ error }));
  }
}

export function* getSparklineSaga(action: GetSparklineRequestedAction) {
  try {
    const { id, currency = "usd", days, interval } = action.payload;

    const apiUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&interval=${interval}`;

    const response: ResponseGenerator = yield call([axios, axios.get], apiUrl);
    yield put(getSparklineSucceeded({ sparkline: response.data.prices }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getSparklineFailed({ error }));
  }
}

export function* refreshHomeScreenSaga(action: RefreshHomeScreenRequestedAction) {
  const { id, days, interval, priceChangePerc } = action.payload;
  yield call(getSparklineSaga, getSparklineRequested({ id, days, interval }));
  yield call(getCoinMarketSaga, getCoinMarketRequested({ priceChangePerc }));
  yield put(refreshHomeScreenSucceeded());
}

function* marketSaga() {
  yield takeLatest(getHoldingsRequested.type, getHoldingsSaga);
  yield takeLatest(getCoinMarketRequested.type, getCoinMarketSaga);
  yield takeLatest(getSparklineRequested.type, getSparklineSaga);
  yield takeLatest(refreshHomeScreenRequested.type, refreshHomeScreenSaga);
}

export default marketSaga;
