/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  loadingFrontloadApp: boolean;
  errorFrontloadApp?: Error;
}

const initialState: SettingsState = {
  loadingFrontloadApp: true, // must start with true
  errorFrontloadApp: undefined,
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
  },
});

export const {
  frontloadAppRequested,
  frontloadAppSucceeded,
  frontloadAppFailed,
} = settingsSlice.actions;

export default settingsSlice.reducer;
