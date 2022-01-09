/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateMnemonic } from "bip39";
import { State } from "react-native-gesture-handler";

import { DapperWallet } from "../../types";

export interface WalletState {
  wallets?: DapperWallet[];
  loadingGetWallets: boolean;
  errorGetWallets?: Error;
  loadingAddWallet: boolean;
  errorAddWallet?: Error;
  loadingRemoveWallet: boolean;
  errorRemoveWallet?: Error;
  onboarded: boolean;
  loadingOnboardWallet: boolean;
  errorOnboardWallet?: Error;
  nextIndex: number;
  loadingAddNextWallet: boolean;
  errorAddNextWallet?: Error;
}

const initialState: WalletState = {
  wallets: [],
  loadingGetWallets: false,
  errorGetWallets: undefined,
  loadingAddWallet: false,
  errorAddWallet: undefined,
  loadingRemoveWallet: false,
  errorRemoveWallet: undefined,
  onboarded: false,
  loadingOnboardWallet: false,
  errorOnboardWallet: undefined,
  nextIndex: 0,
  loadingAddNextWallet: false,
  errorAddNextWallet: undefined,
};

export type GetWalletsRequestedAction = PayloadAction<undefined>;
export type AddWalletRequestedAction = PayloadAction<{ wallet: DapperWallet }>;
export type RemoveWalletRequestedAction = PayloadAction<{ address: string }>;

type ErrorAction = PayloadAction<{ error: Error }>;

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    getWalletsRequested: (state, _: GetWalletsRequestedAction) => {
      state.loadingGetWallets = true;
    },
    getWalletsSucceeded: (state, action: PayloadAction<{ wallets: DapperWallet[] }>) => {
      const { wallets } = action.payload;
      state.loadingGetWallets = false;
      state.wallets = wallets;
    },
    getWalletsFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetWallets = false;
      state.errorGetWallets = error;
    },
    addWalletRequested: (state, _: AddWalletRequestedAction) => {
      state.loadingGetWallets = true;
    },
    addWalletSucceeded: (state, action: PayloadAction<{ wallets: DapperWallet[] }>) => {
      const { wallets } = action.payload;
      state.loadingGetWallets = false;
      state.wallets = wallets;
    },
    addWalletFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetWallets = false;
      state.errorGetWallets = error;
    },
    removeWalletRequested: (state, _: RemoveWalletRequestedAction) => {
      state.loadingGetWallets = true;
    },
    removeWalletSucceeded: (state, action: PayloadAction<{ wallets: DapperWallet[] }>) => {
      const { wallets } = action.payload;
      state.loadingRemoveWallet = false;
      state.wallets = wallets;
    },
    removeWalletFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingRemoveWallet = false;
      state.errorRemoveWallet = error;
    },
    resetWallets: (state, _: PayloadAction<undefined>) => {
      state.wallets = [];
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
    addNextWalletRequested: (state, _: PayloadAction<{ walletName: string }>) => {
      state.loadingAddNextWallet = true;
    },
    addNextWalletSucceeded: (state, _: PayloadAction<{ walletName: string }>) => {
      state.loadingAddNextWallet = false;
    },
    addNextWalletFailed: (state, action: PayloadAction<{ error: Error }>) => {
      state.loadingAddNextWallet = false;
      state.errorAddNextWallet = action.payload.error;
    },
  },
});

export const {
  getWalletsRequested,
  getWalletsSucceeded,
  getWalletsFailed,
  addWalletRequested,
  addWalletSucceeded,
  addWalletFailed,
  removeWalletRequested,
  removeWalletSucceeded,
  removeWalletFailed,
  resetWallets,
  onboardWalletRequested,
  onboardWalletSucceeded,
  onboardWalletFailed,
  setOnboardStatus,
  setNextIndex,
  addNextWalletRequested,
  addNextWalletSucceeded,
  addNextWalletFailed,
} = walletSlice.actions;

export default walletSlice.reducer;
