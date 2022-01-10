import { AnyAction, Store } from "@reduxjs/toolkit";

import { injectStore } from "../api/web3";

const providerMiddleware = (store: Store<any>) => (next) => (action: AnyAction) => {
  const prevEncryptedSeedPhrase = store?.getState?.()?.settings?.encryptedSeedPhrase;
  next(action);
  const encryptedSeedPhrase = store?.getState?.()?.settings?.encryptedSeedPhrase;
  if (prevEncryptedSeedPhrase !== encryptedSeedPhrase) {
    console.log(`Seed phrase changed`);
    injectStore(store);
  }
};

export default providerMiddleware;
