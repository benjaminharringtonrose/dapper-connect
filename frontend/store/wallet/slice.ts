/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Wallet } from "../../types";

export interface WalletState {
  wallets?: Wallet[];
  loadingGetWallets: boolean;
  errorGetWallets?: Error;
  loadingAddWallet: boolean;
  errorAddWallet?: Error;
  loadingRemoveWallet: boolean;
  errorRemoveWallet?: Error;
}

const initialState: WalletState = {
  wallets: [],
  loadingGetWallets: false,
  errorGetWallets: undefined,
  loadingAddWallet: false,
  errorAddWallet: undefined,
  loadingRemoveWallet: false,
  errorRemoveWallet: undefined,
};

export type GetWalletsRequestedAction = PayloadAction<undefined>;

type ErrorAction = PayloadAction<{ error: Error }>;

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    getWalletsRequested: (state, _: GetWalletsRequestedAction) => {
      state.loadingGetWallets = true;
    },
    getWalletsSucceeded: (state, action: PayloadAction<{ wallets: Wallet[] }>) => {
      const { wallets } = action.payload;
      state.loadingGetWallets = false;
      state.wallets = wallets;
    },
    getWalletsFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetWallets = false;
      state.errorGetWallets = error;
    },
    addWalletRequested: (state, _: PayloadAction<{ wallet: Record<string, unknown> }>) => {
      state.loadingGetWallets = true;
    },
    addWalletSucceeded: (state, action: PayloadAction<{ wallets: Wallet[] }>) => {
      const { wallets } = action.payload;
      state.loadingGetWallets = false;
      state.wallets = wallets;
    },
    addWalletFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetWallets = false;
      state.errorGetWallets = error;
    },
    removeWalletRequested: (state, _: PayloadAction<{ address: string }>) => {
      state.loadingGetWallets = true;
    },
    removeWalletSucceeded: (state, action: PayloadAction<{ wallets: Wallet[] }>) => {
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
} = walletSlice.actions;

export default walletSlice.reducer;
