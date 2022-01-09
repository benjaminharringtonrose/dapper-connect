import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import {
  getAddressInSecureStorage,
  getColorScheme,
  getFaceIDInSecureStorage,
  getNetwork,
  getNextIndexInSecureStorage,
  getOnboardStatus,
  getPrivateKey,
  removeAcknowledgementsInSecureStorage,
  removeColorSchemeInSecureStorage,
  removeFaceIDInSecureStorage,
  removeNetworkInSecureStorage,
  removeNextIndexInSecureStorage,
  removeOnboardStatusInSecureStorage,
  removePasswordInSecureStorage,
  removePrivateKeyInSecureStorage,
  removeSeedPhraseInSecureStorage,
  removeSelectedWalletInSecureStorage,
  resetWalletsInSecureStorage,
  setColorSchemeInSecureStorage,
  toggleFaceIDInSecureStorage,
} from "../../helpers";
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
    const faceID: boolean = yield call(getFaceIDInSecureStorage);
    const colorScheme: ColorScheme = yield call(getColorScheme);
    const onboarded: boolean = yield call(getOnboardStatus);
    const nextIndex: number = yield call(getNextIndexInSecureStorage);
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
    yield call(setColorSchemeInSecureStorage, colorScheme);
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
  }
}

export function* hardResetSaga() {
  try {
    const address = yield call(getAddressInSecureStorage);
    const { privateKey } = yield call(getPrivateKey, address);
    yield call(removeSeedPhraseInSecureStorage, privateKey);
    yield call(resetWalletsInSecureStorage);
    yield call(removeNetworkInSecureStorage);
    yield call(removeColorSchemeInSecureStorage);
    yield call(removeFaceIDInSecureStorage);
    yield call(removePrivateKeyInSecureStorage);
    yield call(removeSelectedWalletInSecureStorage);
    yield call(removeOnboardStatusInSecureStorage);
    yield call(removeNextIndexInSecureStorage);
    yield call(removeAcknowledgementsInSecureStorage);
    yield call(removePasswordInSecureStorage);
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
      yield call(toggleFaceIDInSecureStorage, "true");
    } else {
      yield call(toggleFaceIDInSecureStorage, "false");
    }
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
