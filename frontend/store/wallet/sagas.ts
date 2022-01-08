/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction } from "@reduxjs/toolkit";
import { entropyToMnemonic, generateMnemonic } from "bip39";
import { addHexPrefix } from "ethereumjs-util";
import * as Random from "expo-random";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { DEFAULT_WALLET_NAME, PEACE_COLORS } from "../../constants";
import {
  addWallet,
  deriveAccountFromMnemonic,
  getAddressInSecureStorage,
  getAllWallets,
  getNextIndexInSecureStorage,
  getPrivateKey,
  getSeedPhrase,
  removeWallet,
  saveAddress,
  saveNextIndex,
  saveOnboardStatus,
  savePrivateKey,
  saveSeedPhrase,
  toChecksumAddress,
} from "../../helpers";
import { DapperWallet } from "../../types";
import {
  addNextWalletFailed,
  addNextWalletRequested,
  addNextWalletSucceeded,
  AddWalletRequestedAction,
  getWalletsFailed,
  getWalletsRequested,
  GetWalletsRequestedAction,
  getWalletsSucceeded,
  onboardCreateWalletFailed,
  onboardCreateWalletRequested,
  onboardCreateWalletSucceeded,
  RemoveWalletRequestedAction,
} from "../wallet/slice";

import {
  addWalletFailed,
  addWalletRequested,
  addWalletSucceeded,
  removeWalletFailed,
  removeWalletRequested,
  removeWalletSucceeded,
} from "./slice";

export function* onboardCreateWalletSaga(_: PayloadAction<undefined>) {
  try {
    // const seedPhrase = yield call(generateMnemonic);
    const randomBytes = yield call(Random.getRandomBytesAsync, 16);
    const seedPhrase = entropyToMnemonic(randomBytes);
    console.log(seedPhrase);
    const { wallet } = yield call(deriveAccountFromMnemonic, seedPhrase, 0);
    const walletAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
    const walletPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));

    yield call(saveNextIndex, 0);
    yield call(savePrivateKey, walletAddress, walletPkey);
    yield call(saveSeedPhrase, seedPhrase, walletPkey);
    yield call(saveAddress, walletAddress);

    const color = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];

    const dapperWallet: DapperWallet = {
      name: DEFAULT_WALLET_NAME,
      address: walletAddress,
      color,
      privateKey: walletPkey,
      primary: true,
      provider: "local",
    };

    yield call(addWalletSaga, addWalletRequested({ wallet: dapperWallet }));

    yield put(onboardCreateWalletSucceeded());
  } catch (error) {
    console.log("onboardCreateWalletSaga Error: ", error);
    console.warn("onboardCreateWalletSaga Error: ", error);
    put(onboardCreateWalletFailed({ error }));
  }
}

export function* getWalletsSaga(_: GetWalletsRequestedAction) {
  try {
    const wallets: DapperWallet[] = yield call(getAllWallets);
    yield put(getWalletsSucceeded({ wallets }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getWalletsFailed({ error }));
  }
}

export function* addWalletSaga(action: AddWalletRequestedAction) {
  try {
    const { wallet } = action.payload;
    const prevWallets: DapperWallet[] = yield select((state) => state.wallets.wallets);
    const wallets = yield call(addWallet, wallet, prevWallets);
    yield put(addWalletSucceeded({ wallets }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(addWalletFailed({ error }));
  }
}

export function* addNextWalletSaga(action: PayloadAction<{ walletName: string }>) {
  const { walletName } = action.payload;
  try {
    const nextIndex = yield call(getNextIndexInSecureStorage);
    const address = yield call(getAddressInSecureStorage);
    const { privateKey } = yield call(getPrivateKey, address);
    const { seedPhrase } = yield call(getSeedPhrase, privateKey);
    const { wallet } = deriveAccountFromMnemonic(seedPhrase as string, nextIndex);
    const walletColor = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];
    const walletAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
    const walletPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));
    const nextDapperWallet: DapperWallet = {
      name: walletName,
      color: walletColor,
      address: walletAddress,
      privateKey: walletPkey,
      provider: "local",
      primary: false,
    };
    yield call(saveNextIndex, nextIndex + 1);
    yield call(addWalletSaga, addWalletRequested({ wallet: nextDapperWallet }));
    yield put(addNextWalletSucceeded());
  } catch (error) {
    console.log("addNextWalletSaga Error:", error);
    console.warn("addNextWalletSaga Error:", error);
    yield put(addNextWalletFailed({ error }));
  }
}

export function* removeWalletSaga(action: RemoveWalletRequestedAction) {
  try {
    const { address } = action.payload;
    const prevWallets: DapperWallet[] = yield select((state) => state.wallets.wallets);
    const wallets = yield call(removeWallet, address, prevWallets);
    yield put(removeWalletSucceeded({ wallets }));
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
  yield takeLatest(onboardCreateWalletRequested.type, onboardCreateWalletSaga);
  yield takeLatest(addNextWalletRequested.type, addNextWalletSaga);
}

export default walletSaga;
