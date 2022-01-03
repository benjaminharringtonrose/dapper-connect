/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ColorScheme, Network } from "../../types";

export interface SettingsState {
  loadingFrontloadApp: boolean;
  errorFrontloadApp?: Error;
  toastMessages: string[];
  network?: Network;
  colorScheme: ColorScheme;
}

const initialState: SettingsState = {
  loadingFrontloadApp: true, // must start with true
  errorFrontloadApp: undefined,
  toastMessages: [],
  network: undefined,
  colorScheme: "dark",
};

type ErrorAction = PayloadAction<{ error: Error }>;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    frontloadAppRequested: (state, _: PayloadAction<undefined>) => {
      state.loadingFrontloadApp = true;
    },
    frontloadAppSucceeded: (state, _: PayloadAction<undefined>) => {
      state.loadingFrontloadApp = false;
    },
    frontloadAppFailed: (state, action: ErrorAction) => {
      const { error } = action.payload;
      state.loadingFrontloadApp = false;
      state.errorFrontloadApp = error;
    },
    setToastMessages: (state, action: PayloadAction<{ toastMessages: string[] }>) => {
      const { toastMessages } = action.payload;
      state.toastMessages = toastMessages;
    },
    setNetwork: (state, action: PayloadAction<{ network: Network }>) => {
      const { network } = action.payload;
      state.network = network;
    },
    setColorScheme: (state, action: PayloadAction<{ colorScheme: ColorScheme }>) => {
      const { colorScheme } = action.payload;
      state.colorScheme = colorScheme;
    },
  },
});

export const {
  frontloadAppRequested,
  frontloadAppSucceeded,
  frontloadAppFailed,
  setToastMessages,
  setNetwork,
  setColorScheme,
} = settingsSlice.actions;

export default settingsSlice.reducer;
