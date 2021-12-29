import { call, delay, put, takeLatest } from "redux-saga/effects";

import { getExchangesSaga } from "../exchange/sagas";
import { getExchangesRequested } from "../exchange/slice";
import { getCoinMarketSaga, getSparklineSaga } from "../market/sagas";
import { getCoinMarketRequested, getSparklineRequested } from "../market/slice";

import { frontloadAppFailed, frontloadAppRequested, frontloadAppSucceeded } from "./slice";

function* frontloadAppSaga() {
  // we use `call` instead of `put` because `call` waits for the saga to be executed,
  // while `put` is non-blocking. We don't want to begin loading the app until
  // these network requests are done.
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
