import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";

import { secureStore } from "../../classes";
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
    const network: Network = yield call(secureStore.getNetwork);
    const faceID: boolean = yield call(secureStore.getFaceID);
    const colorScheme: ColorScheme = yield call(secureStore.getColorScheme);
    const onboarded: boolean = yield call(secureStore.getOnboardStatus);
    const nextIndex: number = yield call(secureStore.getNextIndex);
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
    yield call(secureStore.setColorScheme, colorScheme);
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
  }
}

export function* hardResetSaga() {
  try {
    const address = yield call(secureStore.getAddress);
    const { privateKey } = yield call(secureStore.getPrivateKey, address);
    yield call(secureStore.removeSeedPhrase, privateKey);
    yield call(secureStore.resetWallets);
    yield call(secureStore.removeNetwork);
    yield call(secureStore.removeColorScheme);
    yield call(secureStore.removeFaceID);
    yield call(secureStore.removePrivateKey);
    yield call(secureStore.removeSelectedWallet);
    yield call(secureStore.removeOnboardStatus);
    yield call(secureStore.removeNextIndex);
    yield call(secureStore.removeAcknowledgements);
    yield call(secureStore.removePassword);
    yield put(hardResetAppSucceeded());
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
  }
}

export function* toggleFaceIDSaga(action: PayloadAction<{ faceID: boolean }>) {
  try {
    const { faceID } = action.payload;
    yield call(secureStore.setFaceID, faceID);
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
  }
}

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
  yield takeLatest(setColorScheme.type, setColorSchemeSaga);
  yield takeLatest(hardResetAppRequested.type, hardResetSaga);
  yield takeLatest(toggleFaceId.type, toggleFaceIDSaga);
}

export default settingsSaga;
