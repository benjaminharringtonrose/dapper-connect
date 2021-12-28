/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Account, Coin, Holding, User } from "../../types";

export interface AccountState {
  account?: Account;
  loadingGetAccount: boolean;
  errorGetAccount?: Error;
  user?: User;
  loadingGetUser: boolean;
  errorGetUser?: Error;
}

const initialState: AccountState = {
  account: undefined,
  loadingGetAccount: false,
  errorGetAccount: undefined,
  user: undefined,
  loadingGetUser: false,
  errorGetUser: undefined,
};

export type GetAccountRequestedAction = PayloadAction<{ address: string }>;

type ErrorAction = PayloadAction<{ error: Error }>;

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    getAccountRequested: (state, _: GetAccountRequestedAction) => {
      state.loadingGetAccount = true;
    },
    getAccountSucceeded: (state, action: PayloadAction<{ account: any }>) => {
      const { account } = action.payload;
      state.loadingGetAccount = false;
      state.account = account;
    },
    getAccountFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetAccount = false;
      state.errorGetAccount = error;
    },
    loadingGetCurrentUser(state) {
      state.loadingGetUser = true;
      state.errorGetUser = undefined;
    },
    errorGetCurrentUser(state, action: PayloadAction<{ error: Error }>) {
      state.loadingGetUser = false;
      state.errorGetUser = action.payload.error;
    },
    updateUser: (state, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      state.user = user;
    },
  },
});

export const {
  getAccountRequested,
  getAccountSucceeded,
  getAccountFailed,
  loadingGetCurrentUser,
  errorGetCurrentUser,
  updateUser,
} = accountSlice.actions;

export default accountSlice.reducer;
