import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { ColorScheme, Days, Interval, Network } from "../../types";
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
  setColorScheme,
  setNetwork,
} from "./slice";

export const NETWORK = "NETWORK";
export const COLOR_SCHEME = "COLOR_SCHEME";

export function* frontloadAppSaga() {
  try {
    const network: Network = yield call(getNetwork);
    yield put(setNetwork({ network }));
    const colorScheme: ColorScheme = yield call(getColorScheme);
    yield put(setColorScheme({ colorScheme }));
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
    console.log(error.message);
    console.warn(error.message);
    yield put(frontloadAppFailed({ error }));
  }
}

export function* setColorSchemeSaga(action: PayloadAction<{ colorScheme: ColorScheme }>) {
  try {
    const { colorScheme } = action.payload;
    yield call(setColorSchemeInDeviceStorage, colorScheme);
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
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

export const getColorScheme = async (): Promise<string> => {
  const colorScheme = await loadString(COLOR_SCHEME);
  if (!colorScheme) return "dark";
  return colorScheme;
};

export const setColorSchemeInDeviceStorage = async (colorScheme: ColorScheme): Promise<void> => {
  return await saveString(COLOR_SCHEME, colorScheme);
};

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
  yield takeLatest(setColorScheme.type, setColorSchemeSaga);
}

export default settingsSaga;
