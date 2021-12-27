/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { Exchange } from "../../types";
import { ResponseGenerator } from "../market/sagas";

import {
  GetExchangeRequestedAction,
  getExchangesFailed,
  getExchangesRequested,
  getExchangesSucceeded,
} from "./slice";

export function* getExchangesSaga(_: GetExchangeRequestedAction) {
  try {
    const apiUrl = `https://api.coingecko.com/api/v3/exchanges`;
    const response: ResponseGenerator = yield call([axios, axios.get], apiUrl);
    const exchanges = response.data as Exchange[];
    yield put(getExchangesSucceeded({ exchanges }));
  } catch (error) {
    console.warn(error);
    yield put(getExchangesFailed({ error }));
  }
}

function* exchangeSaga() {
  yield takeLatest(getExchangesRequested.type, getExchangesSaga);
}

export default exchangeSaga;
