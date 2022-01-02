/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Coin, Days, Holding, Interval, PriceChangePerc } from "../../types";

export interface MarketState {
  holdings: Holding[];
  loadingGetHoldings: boolean;
  errorGetHoldings?: Error;
  coins: Coin[];
  loadingGetCoinMarket: boolean;
  errorGetCoinMarket?: Error;
  sparkline: number[][];
  loadingGetSparkline: boolean;
  errorGetSparkline?: Error;
  refreshingHomeScreen: boolean;
}

const initialState: MarketState = {
  holdings: [],
  loadingGetHoldings: false,
  errorGetHoldings: undefined,
  coins: [],
  loadingGetCoinMarket: false,
  errorGetCoinMarket: undefined,
  sparkline: [],
  loadingGetSparkline: false,
  errorGetSparkline: undefined,
  refreshingHomeScreen: false,
};

type ErrorAction = PayloadAction<{ error: Error }>;

export type GetHoldingsRequestedAction = PayloadAction<{
  holdings?: any[];
  currency?: string;
  orderBy?: string;
  sparkline?: boolean;
  priceChangePerc?: PriceChangePerc;
  perPage?: number;
  page?: number;
}>;

export type GetCoinMarketRequestedAction = PayloadAction<{
  currency?: string;
  orderBy?: string;
  sparkline?: boolean;
  perPage?: number;
  page?: number;
}>;

export type GetSparklineRequestedAction = PayloadAction<{
  id: string;
  currency?: string;
  days: string;
  interval: string;
}>;

export type RefreshHomeScreenRequestedAction = PayloadAction<{
  id: string;
  days: Days;
  interval: Interval;
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
    resetHoldings: (state, _: PayloadAction<undefined>) => {
      state.holdings = [];
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
    getSparklineRequested: (state, _: GetSparklineRequestedAction) => {
      state.loadingGetSparkline = true;
    },
    getSparklineSucceeded: (state, action: PayloadAction<{ sparkline: any[] }>) => {
      const { sparkline } = action.payload;
      state.loadingGetSparkline = false;
      state.sparkline = sparkline;
    },
    getSparklineFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingGetSparkline = false;
      state.errorGetSparkline = error;
    },
    refreshHomeScreenRequested: (state, _: RefreshHomeScreenRequestedAction) => {
      state.refreshingHomeScreen = true;
    },
    refreshHomeScreenSucceeded: (state, _: PayloadAction<undefined>) => {
      state.refreshingHomeScreen = false;
    },
  },
});

export const {
  getHoldingsRequested,
  getHoldingsSucceeded,
  getHoldingsFailed,
  resetHoldings,
  getCoinMarketRequested,
  getCoinMarketSucceeded,
  getCoinMarketFailed,
  getSparklineRequested,
  getSparklineSucceeded,
  getSparklineFailed,
  refreshHomeScreenRequested,
  refreshHomeScreenSucceeded,
} = marketSlice.actions;

export default marketSlice.reducer;
