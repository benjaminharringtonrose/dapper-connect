/* eslint-disable @typescript-eslint/no-unused-vars */
import { SECRET_KEY } from "@env";
import { Wallet } from "@ethersproject/wallet";
import { PayloadAction } from "@reduxjs/toolkit";
import { entropyToMnemonic } from "bip39";
import CryptoJS from "crypto-js";
import { addHexPrefix } from "ethereumjs-util";
import * as Random from "expo-random";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { web3 } from "../../api/web3";
import { secureStore } from "../../classes";
import { DEFAULT_WALLET_NAME } from "../../constants";
import {
  addAccount,
  addressHashedColor,
  deriveAccountFromMnemonic,
  getAllAccounts,
  hasPreviousTransactions,
  removeAccount,
  toChecksumAddress,
} from "../../helpers";
import { WalletAccount } from "../../types";
import { setEncryptedSeedPhrase } from "../settings/slice";
import {
  AddAccountRequestedAction,
  getAccountsFailed,
  getAccountsRequested,
  GetAccountsRequestedAction,
  getAccountsSucceeded,
  onboardWalletFailed,
  onboardWalletRequested,
  onboardWalletSucceeded,
  RemoveAccountRequestedAction,
} from "../wallet/slice";

import {
  addAccountFailed,
  addAccountRequested,
  addAccountSucceeded,
  removeAccountFailed,
  removeAccountRequested,
  removeAccountSucceeded,
} from "./slice";

export function* onboardWalletSaga(action: PayloadAction<{ seedPhrase?: string }>) {
  try {
    let seed: string | undefined;
    const { seedPhrase } = action.payload;
    seed = seedPhrase;
    console.log("onboardWalletSaga seed:", seed);
    // if no seed, create one
    if (!seed) {
      const randomBytes = yield call(Random.getRandomBytesAsync, 16);
      seed = entropyToMnemonic(randomBytes);
    }
    // index 0 because first wallet
    const { wallet, root } = yield call(deriveAccountFromMnemonic, seed, 0);
    const accountAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
    const accountPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));
    yield call(secureStore.setSeedPhrase, seed, accountPkey);
    yield call(secureStore.setNextIndex, 1);
    yield call(secureStore.setPrivateKey, accountAddress, accountPkey);
    yield call(secureStore.setAddress, accountAddress);

    const encryptedSeedPhrase = CryptoJS.AES.encrypt(seed, SECRET_KEY).toString();
    yield put(setEncryptedSeedPhrase({ encryptedSeedPhrase }));

    const color = addressHashedColor(accountAddress);

    const account: WalletAccount = {
      name: DEFAULT_WALLET_NAME,
      address: accountAddress,
      color,
      privateKey: accountPkey,
      primary: true,
      provider: "local",
    };

    yield call(addAccountSaga, addAccountRequested({ account }));

    // Starting on index 1, we are gonna hit etherscan API and check the tx history
    // for each account. If there's history we add it to the wallet.
    //(We stop once we find the first one with no history)
    const index = 1;
    let lookup = true;
    while (lookup) {
      const child = root.deriveChild(index);
      const walletObj = child.getWallet();
      const nextWallet = new Wallet(addHexPrefix(walletObj.getPrivateKey().toString("hex")));

      const hasTxHistory = yield call(hasPreviousTransactions, nextWallet.address);
      console.log(hasTxHistory);
      if (hasTxHistory) {
        console.log("hasTxHistory:", hasTxHistory);
      } else {
        lookup = false;
      }
    }

    yield put(onboardWalletSucceeded());
  } catch (error) {
    console.log("onboardWalletSaga Error: ", error);
    console.warn("onboardWalletSaga Error: ", error);
    put(onboardWalletFailed({ error }));
  }
}

export function* getAccountsSaga(_: GetAccountsRequestedAction) {
  try {
    const accounts: WalletAccount[] = yield call(getAllAccounts);
    accounts.forEach((account) => {
      web3.eth.accounts.wallet.add({
        address: account.address,
        privateKey: account.privateKey,
      });
    });
    yield put(getAccountsSucceeded({ accounts }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getAccountsFailed({ error }));
  }
}

export function* addAccountSaga(action: AddAccountRequestedAction) {
  try {
    const { account } = action.payload;
    const prevAccounts: WalletAccount[] = yield select((state) => state.wallets.accounts);
    const accounts = yield call(addAccount, account, prevAccounts);

    web3.eth.accounts.wallet.add({
      address: account.address,
      privateKey: account.privateKey,
    });

    yield put(addAccountSucceeded({ accounts }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(addAccountFailed({ error }));
  }
}

export function* removeAccountSaga(action: RemoveAccountRequestedAction) {
  try {
    const { address } = action.payload;
    const prevAccounts: WalletAccount[] = yield select((state) => state.wallets.accounts);
    const accounts = yield call(removeAccount, address, prevAccounts);

    web3.eth.accounts.wallet.remove(address);

    yield put(removeAccountSucceeded({ accounts }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(removeAccountFailed({ error }));
  }
}

function* walletSaga() {
  yield takeLatest(getAccountsRequested.type, getAccountsSaga);
  yield takeLatest(addAccountRequested.type, addAccountSaga);
  yield takeLatest(removeAccountRequested.type, removeAccountSaga);
  yield takeLatest(onboardWalletRequested.type, onboardWalletSaga);
}

export default walletSaga;
