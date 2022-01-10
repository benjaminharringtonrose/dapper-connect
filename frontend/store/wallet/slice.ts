/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateMnemonic } from "bip39";
import { State } from "react-native-gesture-handler";

import { WalletAccount } from "../../types";

export interface WalletState {
  accounts?: WalletAccount[];
  loadingGetAccounts: boolean;
  errorGetAccounts?: Error;
  loadingAddAccount: boolean;
  errorAddAccount?: Error;
  loadingRemoveAccount: boolean;
  errorRemoveAccount?: Error;
  onboarded: boolean;
  loadingOnboardWallet: boolean;
  errorOnboardWallet?: Error;
  nextIndex: number;
  loadingAddNextAccount: boolean;
  errorAddNextAccount?: Error;
}

const initialState: WalletState = {
  accounts: [],
  loadingGetAccounts: false,
  errorGetAccounts: undefined,
  loadingAddAccount: false,
  errorAddAccount: undefined,
  loadingRemoveAccount: false,
  errorRemoveAccount: undefined,
  onboarded: false,
  loadingOnboardWallet: false,
  errorOnboardWallet: undefined,
  nextIndex: 0,
  loadingAddNextAccount: false,
  errorAddNextAccount: undefined,
};

export type GetAccountsRequestedAction = PayloadAction<undefined>;
export type AddAccountRequestedAction = PayloadAction<{ account: WalletAccount }>;
export type RemoveAccountRequestedAction = PayloadAction<{ address: string }>;

type ErrorAction = PayloadAction<{ error: Error }>;

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    getAccountsRequested: (state, _: GetAccountsRequestedAction) => {
      state.loadingGetAccounts = true;
    },
    getAccountsSucceeded: (state, action: PayloadAction<{ accounts: WalletAccount[] }>) => {
      const { accounts } = action.payload;
      state.loadingGetAccounts = false;
      state.accounts = accounts;
    },
    getAccountsFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetAccounts = false;
      state.errorGetAccounts = error;
    },
    addAccountRequested: (state, _: AddAccountRequestedAction) => {
      state.loadingGetAccounts = true;
    },
    addAccountSucceeded: (state, action: PayloadAction<{ accounts: WalletAccount[] }>) => {
      const { accounts } = action.payload;
      state.loadingGetAccounts = false;
      state.accounts = accounts;
    },
    addAccountFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingAddAccount = false;
      state.errorAddAccount = error;
    },
    removeAccountRequested: (state, _: RemoveAccountRequestedAction) => {
      state.loadingRemoveAccount = true;
    },
    removeAccountSucceeded: (state, action: PayloadAction<{ accounts: WalletAccount[] }>) => {
      const { accounts } = action.payload;
      state.loadingRemoveAccount = false;
      state.accounts = accounts;
    },
    removeAccountFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingRemoveAccount = false;
      state.errorRemoveAccount = error;
    },
    resetAccounts: (state, _: PayloadAction<undefined>) => {
      state.accounts = [];
    },
    onboardWalletRequested: (state, _: PayloadAction<{ seedPhrase?: string }>) => {
      state.loadingOnboardWallet = true;
    },
    onboardWalletSucceeded: (state, _: PayloadAction<undefined>) => {
      state.loadingOnboardWallet = false;
    },
    onboardWalletFailed: (state, action) => {
      state.loadingOnboardWallet = false;
      state.errorOnboardWallet = action.payload.error;
    },
    setOnboardStatus: (state, action: PayloadAction<{ onboarded: boolean }>) => {
      state.onboarded = action.payload.onboarded;
    },
    setNextIndex: (state, action: PayloadAction<{ nextIndex: number }>) => {
      state.nextIndex = action.payload.nextIndex;
    },
    addNextAccountRequested: (state, _: PayloadAction<{ walletName: string }>) => {
      state.loadingAddNextAccount = true;
    },
    addNextAccountSucceeded: (state, _: PayloadAction<undefined>) => {
      state.loadingAddNextAccount = false;
    },
    addNextAccountFailed: (state, action: PayloadAction<{ error: Error }>) => {
      state.loadingAddNextAccount = false;
      state.errorAddNextAccount = action.payload.error;
    },
  },
});

export const {
  getAccountsRequested,
  getAccountsSucceeded,
  getAccountsFailed,
  addAccountRequested,
  addAccountSucceeded,
  addAccountFailed,
  removeAccountRequested,
  removeAccountSucceeded,
  removeAccountFailed,
  resetAccounts,
  onboardWalletRequested,
  onboardWalletSucceeded,
  onboardWalletFailed,
  setOnboardStatus,
  setNextIndex,
  addNextAccountRequested,
  addNextAccountSucceeded,
  addNextAccountFailed,
} = walletSlice.actions;

export default walletSlice.reducer;
