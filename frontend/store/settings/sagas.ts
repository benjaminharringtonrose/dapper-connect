import { call, delay, put, takeLatest } from "redux-saga/effects";

import { Days, Interval, PriceChangePerc } from "../../types";
import { getExchangesSaga } from "../exchange/sagas";
import { getExchangesRequested } from "../exchange/slice";
import { getCoinMarketRequested, getSparklineRequested } from "../market";
import { getCoinMarketSaga, getSparklineSaga } from "../market/sagas";
import { getWalletsSaga } from "../wallet";
import { getWalletsRequested } from "../wallet";

import { frontloadAppFailed, frontloadAppRequested, frontloadAppSucceeded } from "./slice";

export function* frontloadAppSaga() {
  try {
    yield call(getCoinMarketSaga, getCoinMarketRequested({}));
    yield call(
      getSparklineSaga,
      getSparklineRequested({
        id: "bitcoin",
        days: Days.one,
        interval: Interval.minutely,
      })
    );
    yield call(getExchangesSaga, getExchangesRequested());
    yield call(getWalletsSaga, getWalletsRequested());
    yield delay(1000);
    yield put(frontloadAppSucceeded());
  } catch (error) {
    yield put(frontloadAppFailed({ error }));
  }
}

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
}

export default settingsSaga;
