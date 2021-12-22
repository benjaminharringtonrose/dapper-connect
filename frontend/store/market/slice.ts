import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Coin, Holding } from "../../types";

export interface MarketState {
  holdings: Holding[];
  loadingGetHoldings: boolean;
  errorGetHoldings?: Error;
  coins: Coin[];
  loadingGetCoinMarket: boolean;
  errorGetCoinMarket?: Error;
}

const initialState: MarketState = {
  holdings: [],
  loadingGetHoldings: false,
  errorGetHoldings: undefined,
  coins: [],
  loadingGetCoinMarket: false,
  errorGetCoinMarket: undefined,
};

type ErrorAction = PayloadAction<{ error: Error }>;

export type GetHoldingsRequestedAction = PayloadAction<{
  holdings?: any[];
  currency?: string;
  orderBy?: string;
  sparkline?: boolean;
  priceChangePerc?: string;
  perPage?: number;
  page?: number;
}>;

export type GetCoinMarketRequestedAction = PayloadAction<{
  currency?: string;
  orderBy?: string;
  sparkline?: boolean;
  priceChangePerc?: string;
  perPage?: number;
  page?: number;
}>;

const marketSlice = createSlice({
  name: "market",
  initialState,
  reducers: {
    getHoldingsRequested: (state, _: GetHoldingsRequestedAction) => {
      state.loadingGetHoldings = true;
    },
    getHoldingsSucceeded: (state, action: PayloadAction<{ holdings: Holding[] }>) => {
      const { holdings } = action.payload;
      state.loadingGetHoldings = false;
      state.holdings = holdings;
    },
    getHoldingsFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetHoldings = false;
      state.errorGetHoldings = error;
    },
    getCoinMarketRequested: (state, _: GetCoinMarketRequestedAction) => {
      state.loadingGetCoinMarket = true;
    },
    getCoinMarketSucceeded: (state, action: PayloadAction<{ coins: any[] }>) => {
      const { coins } = action.payload;
      state.loadingGetCoinMarket = false;
      state.coins = coins;
    },
    getCoinMarketFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetCoinMarket = false;
      state.errorGetCoinMarket = error;
    },
  },
});

export const {
  getHoldingsRequested,
  getHoldingsSucceeded,
  getHoldingsFailed,
  getCoinMarketRequested,
  getCoinMarketSucceeded,
  getCoinMarketFailed,
} = marketSlice.actions;

export default marketSlice.reducer;
