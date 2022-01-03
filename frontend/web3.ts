import { KOVAN_API, MAINNET_API } from "@env";
import Web3 from "web3";

import { store } from "./store";

const { network } = store.getState().settings;

const serverEndpoint = network === "mainnet" ? MAINNET_API : KOVAN_API;

const provider = new Web3.providers.HttpProvider(serverEndpoint);

export const web3: Web3 = new Web3(provider);
