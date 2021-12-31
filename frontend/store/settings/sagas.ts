import { call, delay, put, takeLatest } from "redux-saga/effects";

import { getExchangesSaga } from "../exchange/sagas";
import { getExchangesRequested } from "../exchange/slice";
import { getCoinMarketSaga, getSparklineSaga } from "../market/sagas";
import { getCoinMarketRequested, getSparklineRequested } from "../market/slice";
import { getWalletsSaga } from "../wallet/sagas";
import { getWalletsRequested } from "../wallet/slice";

import { frontloadAppFailed, frontloadAppRequested, frontloadAppSucceeded } from "./slice";

function* frontloadAppSaga() {
  try {
    yield call(getCoinMarketSaga, getCoinMarketRequested({}));
    yield call(
      getSparklineSaga,
      getSparklineRequested({
        id: "bitcoin",
        days: "1",
        interval: "minutely",
      })
    );
    yield call(getExchangesSaga, getExchangesRequested());
    yield call(getWalletsSaga, getWalletsRequested());
    yield delay(2000);
    yield put(frontloadAppSucceeded());
  } catch (error) {
    yield put(frontloadAppFailed({ error }));
  }
}

function* settingsSaga() {
  yield takeLatest(frontloadAppRequested.type, frontloadAppSaga);
}

export default settingsSaga;
