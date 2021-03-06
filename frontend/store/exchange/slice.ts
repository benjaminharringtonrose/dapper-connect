/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Exchange } from "../../types";

export interface ExchangeState {
  exchanges?: Exchange[];
  loadingGetExchanges: boolean;
  errorGetExchanges?: Error;
}

const initialState: ExchangeState = {
  exchanges: undefined,
  loadingGetExchanges: false,
  errorGetExchanges: undefined,
};

export type GetExchangeRequestedAction = PayloadAction<undefined>;
export type GetExchangeSucceededAction = PayloadAction<{ exchanges: Exchange[] }>;
type FailedAction = PayloadAction<{ error: Error }>;

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    getExchangesRequested: (state, _: GetExchangeRequestedAction) => {
      state.loadingGetExchanges = true;
    },
    getExchangesSucceeded: (state, action: GetExchangeSucceededAction) => {
      const { exchanges } = action.payload;
      state.loadingGetExchanges = false;
      state.exchanges = exchanges;
    },
    getExchangesFailed: (state, action: FailedAction) => {
      const { error } = action.payload;
      state.loadingGetExchanges = false;
      state.errorGetExchanges = error;
    },
  },
});

export const {
  getExchangesRequested,
  getExchangesSucceeded,
  getExchangesFailed,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
