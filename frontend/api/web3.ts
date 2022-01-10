import { KOVAN_API, MAINNET_API } from "@env";
import { Store } from "@reduxjs/toolkit";
import Web3 from "web3";

import { RootState } from "../store/index";

let store: Store<RootState>;

export const injectStore = (_store: Store<RootState>) => {
  store = _store;
};

const serverEndpoint =
  store?.getState?.()?.settings?.network === "mainnet" ? MAINNET_API : KOVAN_API;

const provider = new Web3.providers.HttpProvider(serverEndpoint);

export const web3: Web3 = new Web3(provider);
