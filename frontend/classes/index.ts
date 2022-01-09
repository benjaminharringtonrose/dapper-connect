import { SecureStore } from "./SecureStore";

let store;

export const injectStoreIntoClasses = (_store) => {
  store = _store;
};

const secureStore = new SecureStore();

export { secureStore };
