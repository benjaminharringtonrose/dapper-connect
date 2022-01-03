import { call, delay, put, takeLatest } from "redux-saga/effects";

import { Days, Interval, Network } from "../../types";
import { getExchangesSaga } from "../exchange/sagas";
import { getExchangesRequested } from "../exchange/slice";
import { loadString, saveString } from "../local";
import { getCoinMarketRequested, getSparklineRequested } from "../market";
import { getCoinMarketSaga, getSparklineSaga } from "../market/sagas";
import { getWalletsSaga } from "../wallet";
import { getWalletsRequested } from "../wallet";

import {
  frontloadAppFailed,
  frontloadAppRequested,
  frontloadAppSucceeded,
  setNetwork,
} from "./slice";

export const NETWORK = "NETWORK";

export function* frontloadAppSaga() {
  try {
    const network: Network = yield call(getNetwork);
    yield put(setNetwork({ network }));
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

export const getNetwork = async (): Promise<string> => {
  const network = await loadString(NETWORK);
  if (!network) return "mainnet";
  return network;
};

export const setNetworkInDeviceStorage = async (network: Network): Promise<void> => {
  return await saveString(NETWORK, network);
};

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
}

export default settingsSaga;
