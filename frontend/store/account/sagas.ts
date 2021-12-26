import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";

import { Account } from "../../types";
import { ResponseGenerator } from "../market/sagas";
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
    const apiUrl = `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`;
    const response: ResponseGenerator = yield call([axios, axios.get], apiUrl);
    const account = response.data as Account;

    const holdings = [{ id: "ethereum", qty: account.ETH.balance }];

    const tokenHoldings = account.tokens.map((token) => {
      return {
        id: token.tokenInfo.coingecko,
        qty: token.balance / 10 ** Number(token.tokenInfo.decimals),
      };
    });

    const allHoldings = holdings.concat(tokenHoldings);

    yield put(getHoldingsRequested({ holdings: allHoldings }));

    yield put(getAccountSucceeded({ account: { ...account, holdings: allHoldings } }));
  } catch (error) {
    console.log(error);
    yield put(getAccountFailed({ error }));
  }
}

function* accountSaga() {
  yield takeLatest(getAccountRequested.type, getAccountSaga);
}

export default accountSaga;
