/* eslint-disable @typescript-eslint/no-unused-vars */
import { call, put, select, takeLatest } from "redux-saga/effects";

import { store } from "..";
import { Wallet } from "../../types";
import { loadString, remove, saveObject } from "../local";
import {
  AddWalletRequestedAction,
  getWalletsFailed,
  getWalletsRequested,
  GetWalletsRequestedAction,
  getWalletsSucceeded,
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

export const ALL_WALLETS = "ALL_WALLETS";

export const getAllWallets = async (): Promise<Wallet[]> => {
  const allWallets = await loadString(ALL_WALLETS);
  if (!allWallets) return [];
  const walletsObject: Record<string, Wallet> = JSON.parse(allWallets);
  const walletsArray: Wallet[] = [];
  for (const [address, wallet] of Object.entries(walletsObject)) {
    walletsArray.push({ ...wallet, address });
  }
  return walletsArray;
};

export const addWallet = async (wallet: Wallet, prevWallets: Wallet[]): Promise<Wallet[]> => {
  let walletsObject = {};
  prevWallets?.forEach((wallet) => {
    walletsObject = {
      ...walletsObject,
      [wallet.address]: wallet,
    };
  });
  walletsObject = {
    ...walletsObject,
    [wallet.address as string]: wallet,
  };
  await saveObject(ALL_WALLETS, walletsObject);
  return await getAllWallets();
};

export const removeWallet = async (address: string, prevWallets: Wallet[]): Promise<Wallet[]> => {
  let walletsObject = {};
  prevWallets?.forEach((wallet) => {
    if (wallet.address !== address) {
      walletsObject = {
        ...walletsObject,
        [wallet.address]: wallet,
      };
    }
  });
  await saveObject(ALL_WALLETS, walletsObject);
  return await getAllWallets();
};

export const resetWalletsInLocalStorage = async () => {
  await remove(ALL_WALLETS);
};

export function* getWalletsSaga(_: GetWalletsRequestedAction) {
  try {
    const wallets: Wallet[] = yield call(getAllWallets);
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
    const prevWallets: Wallet[] = yield select((state) => state.wallets.wallets);
    const wallets = yield call(addWallet, wallet, prevWallets);
    yield put(addWalletSucceeded({ wallets }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(addWalletFailed({ error }));
  }
}

export function* removeWalletSaga(action: RemoveWalletRequestedAction) {
  try {
    const { address } = action.payload;
    const prevWallets: Wallet[] = yield select((state) => state.wallets.wallets);
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
}

export default walletSaga;
