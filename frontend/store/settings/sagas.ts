/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import {
  ADDRESS,
  COLOR_SCHEME,
  FACE_ID,
  NETWORK,
  NEXT_INDEX,
  ONBOARDED,
  PRIVATE_KEY,
  SEED_PHRASE,
  SELECTED_WALLET,
} from "../../constants";
import {
  getNextIndexInDeviceStorage,
  getOnboardStatus,
  resetWalletsInLocalStorage,
} from "../../helpers";
import { loadString, remove, saveString } from "../../helpers";
import { ColorScheme, Days, Interval, Network } from "../../types";
import { getExchangesSaga } from "../exchange/sagas";
import { getExchangesRequested } from "../exchange/slice";
import { getCoinMarketRequested, getSparklineRequested } from "../market";
import { getCoinMarketSaga, getSparklineSaga } from "../market/sagas";
import { getWalletsSaga } from "../wallet";
import { getWalletsRequested } from "../wallet";
import { setNextIndex, setOnboardStatus } from "../wallet/slice";

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

export function* frontloadAppSaga() {
  try {
    const network: Network = yield call(getNetwork);
    const faceID: boolean = yield call(getFaceIDInDeviceStorage);
    const colorScheme: ColorScheme = yield call(getColorScheme);
    const onboarded: boolean = yield call(getOnboardStatus);
    const nextIndex: number = yield call(getNextIndexInDeviceStorage);

    yield put(setNetwork({ network }));
    yield put(toggleFaceId({ faceID }));
    yield put(setColorScheme({ colorScheme }));
    yield put(setOnboardStatus({ onboarded }));
    yield put(setNextIndex({ nextIndex }));

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
    yield call(removePrivateKeyInDeviceStorage);
    yield call(removeSeedPhraseInDeviceStorage);
    yield call(removeSelectedWalletInDeviceStorage);
    yield call(removeOnboardStatusInDeviceStorage);
    yield call(removeNextIndexInDeviceStorage);
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

export const removePrivateKeyInDeviceStorage = async (): Promise<void> => {
  return await remove(PRIVATE_KEY);
};

export const removeAddressInDeviceStorage = async (): Promise<void> => {
  return await remove(ADDRESS);
};

export const removeSeedPhraseInDeviceStorage = async (): Promise<void> => {
  return await remove(SEED_PHRASE);
};

export const removeSelectedWalletInDeviceStorage = async (): Promise<void> => {
  return await remove(SELECTED_WALLET);
};

export const removeOnboardStatusInDeviceStorage = async (): Promise<void> => {
  return await remove(ONBOARDED);
};

export const removeNextIndexInDeviceStorage = async (): Promise<void> => {
  return await remove(NEXT_INDEX);
};

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
  yield takeLatest(setColorScheme.type, setColorSchemeSaga);
  yield takeLatest(hardResetAppRequested.type, hardResetSaga);
  yield takeLatest(toggleFaceId.type, toggleFaceIDSaga);
}

export default settingsSaga;
