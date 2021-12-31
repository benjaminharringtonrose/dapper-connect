/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { RootState } from "..";
import { Wallet } from "../../types";
import { addWallet, getAllWallets } from "../localStorage/wallets";
import { getWalletsFailed, getWalletsRequested, getWalletsSucceeded } from "../wallet/slice";

import {
  addWalletFailed,
  addWalletRequested,
  addWalletSucceeded,
  removeWalletFailed,
  removeWalletRequested,
  removeWalletSucceeded,
} from "./slice";

export function* getWalletsSaga(_: PayloadAction<undefined>) {
  try {
    const wallets: Wallet[] = yield call(getAllWallets);
    yield put(getWalletsSucceeded({ wallets }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getWalletsFailed({ error }));
  }
}

export function* addWalletSaga(action: PayloadAction<{ wallet: any }>) {
  try {
    const { wallet } = action.payload;
    const state: RootState = yield select();

    const wallets = yield call(addWallet, { wallet, prevWallets: state.wallets.wallets });
    yield put(addWalletSucceeded({ wallets }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(addWalletFailed({ error }));
  }
}

export function* removeWalletSaga(action: PayloadAction<{ address: string }>) {
  try {
    const { address } = action.payload;
    const wallets: Wallet[] = yield call(getAllWallets);

    // const wallets = yield call(removeWallet, action.payload);
    // yield put(removeWalletSucceeded({ wallets }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(removeWalletFailed({ error }));
  }
}

function* walletSaga() {
  yield takeLatest(getWalletsRequested.type, getWalletsSaga);
  yield takeLatest(addWalletRequested.type, addWalletSaga);
  yield takeLatest(removeWalletRequested.type, removeWalletSaga);
}

export default walletSaga;
