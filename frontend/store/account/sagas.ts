import { ETHERSCAN_API_KEY, ETHPLORER_API_KEY } from "@env";
import axios from "axios";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { Account, Network, ResponseGenerator } from "../../types";
import { getTokenIdBySymbol } from "../../util";
import { getHoldingsRequested, getHoldingsSaga } from "../market";
import { web3 } from "../web3";

import {
  getAccountFailed,
  getAccountRequested,
  GetAccountRequestedAction,
  getAccountSucceeded,
} from "./slice";

export function* getAccountSaga(action: GetAccountRequestedAction) {
  try {
    const { address } = action.payload;
    const network: Network = yield select((state) => state.settings.network);
    const ethplorerBaseUrl =
      network === "mainnet" ? "https://api.ethplorer.io" : "https://kovan-api.ethplorer.io";
    const ethplorerApiUrl = `${ethplorerBaseUrl}/getAddressInfo/${address}?apiKey=${ETHPLORER_API_KEY}`;
    const ethplorerResponse: ResponseGenerator = yield call([axios, axios.get], ethplorerApiUrl);
    const ethplorerAccount = ethplorerResponse.data as Account;

    const etherscanBaseUrl =
      network === "mainnet" ? "https://api.etherscan.io" : "https://api-kovan.etherscan.io";
    const etherscanApiUrl = `${etherscanBaseUrl}/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    const etherscanResponse: ResponseGenerator = yield call([axios, axios.get], etherscanApiUrl);
    const etherBalance = Number(web3.utils.fromWei(etherscanResponse.data.result, "ether"));

    const holdings = [{ id: "ethereum", qty: etherBalance }];
    const tokenHoldings = ethplorerAccount?.tokens?.map((token) => {
      return {
        id: getTokenIdBySymbol(token.tokenInfo.symbol),
        qty: token.balance / 10 ** Number(token.tokenInfo.decimals),
      };
    });
    const allHoldings = holdings.concat(tokenHoldings);
    yield call(getHoldingsSaga, getHoldingsRequested({ holdings: allHoldings }));
    const account = { ...ethplorerAccount, holdings: allHoldings };

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
