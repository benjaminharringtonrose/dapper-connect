/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { ColorScheme, Days, Interval, Network } from "../../types";
import { getExchangesSaga } from "../exchange/sagas";
import { getExchangesRequested } from "../exchange/slice";
import { loadString, remove, saveString } from "../local";
import { getCoinMarketRequested, getSparklineRequested } from "../market";
import { getCoinMarketSaga, getSparklineSaga } from "../market/sagas";
import { getWalletsSaga, resetWalletsInLocalStorage } from "../wallet";
import { getWalletsRequested } from "../wallet";

import {
  frontloadAppFailed,
  frontloadAppRequested,
  frontloadAppSucceeded,
  hardResetAppRequested,
  hardResetAppSucceeded,
  setColorScheme,
  setNetwork,
  toggleFaceId,
} from "./slice";

export const NETWORK = "NETWORK";
export const COLOR_SCHEME = "COLOR_SCHEME";
export const FACE_ID = "FACE_ID";

export function* frontloadAppSaga() {
  try {
    const network: Network = yield call(getNetwork);
    yield put(setNetwork({ network }));
    const colorScheme: ColorScheme = yield call(getColorScheme);
    const faceID: boolean = yield call(getFaceIDInDeviceStorage);
    console.log("frontloadAppSaga: faceID", faceID);
    yield put(toggleFaceId({ faceID }));
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

export function* hardResetSaga(_: PayloadAction<undefined>) {
  try {
    yield call(resetWalletsInLocalStorage);
    yield call(removeNetworkInDeviceStorage);
    yield call(removeColorSchemeInDeviceStorage);
    yield call(removeFaceIDInDeviceStorage);
    yield put(hardResetAppSucceeded());
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
  }
}

export function* toggleFaceIDSaga(action: PayloadAction<{ faceID: boolean }>) {
  try {
    const { faceID } = action.payload;
    if (faceID) {
      yield call(toggleFaceIDInDeviceStorage, "true");
    } else {
      yield call(toggleFaceIDInDeviceStorage, "false");
    }
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

export const removeNetworkInDeviceStorage = async (): Promise<void> => {
  return await remove(NETWORK);
};

export const getColorScheme = async (): Promise<string> => {
  const colorScheme = await loadString(COLOR_SCHEME);
  if (!colorScheme) return "dark";
  return colorScheme;
};

export const setColorSchemeInDeviceStorage = async (colorScheme: ColorScheme): Promise<void> => {
  return await saveString(COLOR_SCHEME, colorScheme);
};

export const removeColorSchemeInDeviceStorage = async (): Promise<void> => {
  return await remove(COLOR_SCHEME);
};

export const getFaceIDInDeviceStorage = async (): Promise<boolean> => {
  const faceID = await loadString(FACE_ID);
  if (!faceID) return true;
  if (faceID === "true") {
    return true;
  } else {
    return false;
  }
};

export const toggleFaceIDInDeviceStorage = async (faceID: "true" | "false"): Promise<void> => {
  console.log("faceID", faceID);
  return await saveString(FACE_ID, faceID);
};

export const removeFaceIDInDeviceStorage = async (): Promise<void> => {
  return await remove(FACE_ID);
};

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
  yield takeLatest(setColorScheme.type, setColorSchemeSaga);
  yield takeLatest(hardResetAppRequested.type, hardResetSaga);
  yield takeLatest(toggleFaceId.type, toggleFaceIDSaga);
}

export default settingsSaga;
