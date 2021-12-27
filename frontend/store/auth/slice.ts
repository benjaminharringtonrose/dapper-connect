/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthUser } from "../../types";

interface AuthState {
  user?: AuthUser;
  loadingLogin: boolean;
  errorLogin?: Error;
  loadingSignUp: boolean;
  errorSignUp?: Error;
  loadingSignOut: boolean;
  errorSignOut?: Error;
}

const initialState: AuthState = {
  loadingLogin: false,
  loadingSignUp: false,
  loadingSignOut: false,
};

export type SubscribeToAuthUserAction = PayloadAction<{ user?: AuthUser }>;

export type SignInRequestedAction = PayloadAction<{ email: string; password: string }>;
export type SignInSucceededAction = PayloadAction<{ user?: AuthUser }>;
export type SignInFailedAction = PayloadAction<{ error: Error }>;

export type SignUpRequestedAction = PayloadAction<{ email: string; password: string }>;
export type SignUpSucceededAction = PayloadAction<{ user?: AuthUser }>;
export type SignUpFailedAction = PayloadAction<{ error: Error }>;

export type SignOutRequestedAction = PayloadAction<undefined>;
export type SignOutSucceededAction = PayloadAction<undefined>;
export type SignOutFailedAction = PayloadAction<{ error: Error }>;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: SubscribeToAuthUserAction) => {
      const { user } = action.payload;
      state.user = user;
    },
    signInRequested: (state, _: SignInRequestedAction) => {
      state.loadingLogin = true;
    },
    signInSucceeded: (state, action: SignInSucceededAction) => {
      const { user } = action.payload;
      state.user = user;
      state.loadingLogin = false;
    },
    signInFailed: (state, action: SignUpFailedAction) => {
      const { error } = action.payload;
      state.loadingLogin = false;
      state.errorLogin = error;
    },
    signUpRequested: (state, _: SignUpRequestedAction) => {
      state.loadingSignUp = true;
    },
    signUpSucceeded: (state, action: SignUpSucceededAction) => {
      const { user } = action.payload;
      state.user = user;
      state.loadingSignUp = false;
    },
    signUpFailed: (state, action: SignUpFailedAction) => {
      const { error } = action.payload;
      state.loadingSignUp = false;
      state.errorSignUp = error;
    },
    signOutRequested: (state, _: SignOutRequestedAction) => {
      state.loadingSignOut = true;
    },
    signOutSucceeded: (state, _: SignOutSucceededAction) => {
      state.loadingSignOut = false;
    },
    signOutFailed: (state, action: SignOutFailedAction) => {
      const { error } = action.payload;
      state.loadingSignOut = false;
      state.errorSignOut = error;
    },
  },
});

export const {
  setAuthUser,
  signInRequested,
  signInSucceeded,
  signUpFailed,
  signUpRequested,
  signUpSucceeded,
  signInFailed,
  signOutRequested,
  signOutSucceeded,
  signOutFailed,
} = authSlice.actions;

export default authSlice.reducer;
