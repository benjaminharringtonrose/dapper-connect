/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Account, Coin, Holding } from "../../types";

export interface AccountState {
  account?: Account;
  loadingGetAccount: boolean;
  errorGetAccount?: Error;
}

const initialState: AccountState = {
  account: undefined,
  loadingGetAccount: false,
  errorGetAccount: undefined,
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
  },
});

export const { getAccountRequested, getAccountSucceeded, getAccountFailed } = accountSlice.actions;

export default accountSlice.reducer;
