import { applyMiddleware, combineReducers, createStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { fork } from "redux-saga/effects";

import accountSaga from "./account/sagas";
import accountReducer from "./account/slice";
import authSaga from "./auth/sagas";
import authReducer from "./auth/slice";
import exchangeSaga from "./exchange/sagas";
import exchangeReducer from "./exchange/slice";
import marketSaga from "./market/sagas";
import marketReducer from "./market/slice";
import { userListener } from "./middleware/userListener";
import settingsSaga from "./settings/sagas";
import settingsReducer from "./settings/slice";
import tabSaga from "./tab/sagas";
import tabReducer from "./tab/slice";

function* rootSaga() {
  yield fork(accountSaga);
  yield fork(authSaga);
  yield fork(exchangeSaga);
  yield fork(marketSaga);
  yield fork(settingsSaga);
  yield fork(tabSaga);
}

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  account: accountReducer,
  auth: authReducer,
  exchange: exchangeReducer,
  market: marketReducer,
  settings: settingsReducer,
  tabs: tabReducer,
});

export const store = createStore(reducer, applyMiddleware(sagaMiddleware, userListener));

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
