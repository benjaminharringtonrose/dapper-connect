/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ColorScheme, Network } from "../../types";

export interface SettingsState {
  loadingFrontloadApp: boolean;
  errorFrontloadApp?: Error;
  toastMessages: string[];
  network?: Network;
  colorScheme: ColorScheme;
  loadingHardReset: boolean;
  errorHardReset?: Error;
  authenticated: boolean;
  faceID: boolean;
}

export const InitialSettingsState: SettingsState = {
  loadingFrontloadApp: true, // must start with true
  errorFrontloadApp: undefined,
  toastMessages: [],
  network: "mainnet",
  colorScheme: "dark",
  loadingHardReset: false,
  errorHardReset: undefined,
  authenticated: false,
  faceID: false,
};

type ErrorAction = PayloadAction<{ error: Error }>;

const settingsSlice = createSlice({
  name: "settings",
  initialState: InitialSettingsState,
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
    hardResetAppRequested: (state, _: PayloadAction<undefined>) => {
      state.loadingHardReset = true;
    },
    hardResetAppSucceeded: (state, _: PayloadAction<undefined>) => {
      const { toastMessages, network, colorScheme } = InitialSettingsState;
      state.toastMessages = toastMessages;
      state.network = network;
      state.colorScheme = colorScheme;
      state.loadingHardReset = false;
    },
    hardResetAppFailed: (state, action: PayloadAction<{ error: Error }>) => {
      state.loadingHardReset = false;
      state.errorHardReset = action.payload.error;
    },
    setAuthenticated: (state, action: PayloadAction<{ authenticated: boolean }>) => {
      state.authenticated = action.payload.authenticated;
    },
    toggleFaceId: (state, action: PayloadAction<{ faceID: boolean }>) => {
      state.faceID = action.payload.faceID;
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
  hardResetAppRequested,
  hardResetAppSucceeded,
  hardResetAppFailed,
  setAuthenticated,
  toggleFaceId,
} = settingsSlice.actions;

export default settingsSlice.reducer;
