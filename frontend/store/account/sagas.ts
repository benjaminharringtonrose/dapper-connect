import { ENV, ETHPLORER_API_KEY } from "@env";
import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { Account } from "../../types";
import { getHoldingsSaga, ResponseGenerator } from "../market/sagas";
import { getHoldingsRequested } from "../market/slice";

import {
  getAccountFailed,
  getAccountRequested,
  GetAccountRequestedAction,
  getAccountSucceeded,
} from "./slice";

function* getAccountSaga(action: GetAccountRequestedAction) {
  const { address } = action.payload;
  try {
    const baseUrl =
      ENV === "production" ? "https://api.ethplorer.io" : "https://kovan-api.ethplorer.io";
    const apiUrl = `${baseUrl}/getAddressInfo/${address}?apiKey=${ETHPLORER_API_KEY}`;
    console.log("apiUrl", apiUrl);
    const response: ResponseGenerator = yield call([axios, axios.get], apiUrl);
    const accountResponse = response.data as Account;

    const holdings = [{ id: "ethereum", qty: accountResponse.ETH.balance }];
    const tokenHoldings = accountResponse?.tokens?.map((token) => {
      return {
        id: token.tokenInfo.coingecko,
        qty: token.balance / 10 ** Number(token.tokenInfo.decimals),
      };
    });
    const allHoldings = holdings.concat(tokenHoldings);
    yield call(getHoldingsSaga, getHoldingsRequested({ holdings: allHoldings }));
    const account = { ...accountResponse, holdings: allHoldings };

    yield put(getAccountSucceeded({ account }));
  } catch (error) {
    console.log(error.message);
    console.warn(error.message);
    yield put(getAccountFailed({ error }));
  }
}

function* accountSaga() {
  yield takeLatest(getAccountRequested.type, getAccountSaga);
}

export default accountSaga;
