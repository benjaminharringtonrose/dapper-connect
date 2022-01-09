import { AnyAction, Store } from "@reduxjs/toolkit";

import { injectStore } from "../api/web3";

const networkMiddleware = (store: Store<any>) => (next) => (action: AnyAction) => {
  const prevNetwork = store.getState().settings.network;
  next(action);
  const network = store.getState().settings.network;
  if (prevNetwork !== network) {
    console.log(`Switching web3 ${prevNetwork} network provider with ${network} network provider`);
    injectStore(store);
  }
};

export default networkMiddleware;
