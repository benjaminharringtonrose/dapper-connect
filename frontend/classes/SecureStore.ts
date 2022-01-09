/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ExpoSecureStore from "expo-secure-store";

import {
  ACCEPTED_TCS,
  ADDRESS,
  ALL_WALLETS,
  COLOR_SCHEME,
  FACE_ID,
  NETWORK,
  NEXT_INDEX,
  ONBOARDED,
  PASSWORD,
  PRIVATE_KEY,
  privateKeyVersion,
  SEED_PHRASE,
  seedPhraseVersion,
  SELECTED_WALLET,
} from "../constants";
import { ColorScheme, DapperWallet, IStringMap, Network } from "../types";

export class SecureStore {
  resetWallets = async (): Promise<void> => {
    return await this.remove(ALL_WALLETS);
  };
  getOnboardStatus = async (): Promise<boolean> => {
    const onboarded = await this.loadString(ONBOARDED);
    if (onboarded === "true") {
      return true;
    } else {
      return false;
    }
  };
  setOnboardStatus = async (onboarded: boolean): Promise<void> => {
    return await this.saveString(ONBOARDED, onboarded ? "true" : "false");
  };
  removeOnboardStatus = async (): Promise<void> => {
    return await this.remove(ONBOARDED);
  };
  getAcknowledgements = async (): Promise<boolean> => {
    const acceptedTCs = await this.loadString(ACCEPTED_TCS);
    if (acceptedTCs === "true") {
      return true;
    } else {
      return false;
    }
  };
  setAcknowledgements = async (acceptedTCs: boolean): Promise<void> => {
    return await this.saveString(ACCEPTED_TCS, acceptedTCs ? "true" : "false");
  };
  removeAcknowledgements = async (): Promise<void> => {
    return await this.remove(NEXT_INDEX);
  };
  getPrivateKey = async (address: string) => {
    try {
      const obj = await this.loadObject(`${PRIVATE_KEY}_${address}`);
      return {
        address: obj?.address,
        privateKey: obj?.privateKey,
        version: obj?.version,
      };
    } catch (error) {
      console.log("getPrivateKey Error:", error);
      console.warn("getPrivateKey Error:", error);
      return undefined;
    }
  };
  setPrivateKey = async (address: string, privateKey: string) => {
    const key = `${PRIVATE_KEY}_${address}`;
    await this.saveObject(key, {
      address,
      privateKey,
      version: privateKeyVersion,
    });
  };
  removePrivateKey = async (): Promise<void> => {
    return await this.remove(PRIVATE_KEY);
  };
  getSeedPhrase = async (privateKey: string) => {
    try {
      const key = `${SEED_PHRASE}_${privateKey}`;
      const obj = await this.loadObject(key);
      return {
        seedPhrase: obj?.seedPhrase,
      };
    } catch (error) {
      console.log("getSeedPhrase Error:", error);
      console.warn("getSeedPhrase Error:", error);
      return undefined;
    }
  };
  setSeedPhrase = async (seedPhrase: string, privateKey: string): Promise<void> => {
    const key = `${SEED_PHRASE}_${privateKey}`;
    return await this.saveObject(key, {
      privateKey,
      seedPhrase,
      version: seedPhraseVersion,
    });
  };
  removeSeedPhrase = async (privateKey: string): Promise<void> => {
    return await this.remove(`${SEED_PHRASE}_${privateKey}`);
  };
  getAddress = async (): Promise<string> => {
    return await this.loadString(ADDRESS);
  };
  setAddress = async (address: string): Promise<void> => {
    return await this.saveString(ADDRESS, address);
  };
  removeAddress = async (): Promise<void> => {
    return await this.remove(ADDRESS);
  };
  getPassword = async (): Promise<string> => {
    return await this.loadString(PASSWORD);
  };
  setPassword = async (password: string): Promise<void> => {
    return await this.saveString(PASSWORD, password);
  };
  removePassword = async (): Promise<void> => {
    return await this.remove(NEXT_INDEX);
  };
  getNextIndex = async (): Promise<number> => {
    const indexStr = await this.loadString(NEXT_INDEX);
    if (indexStr) {
      return Number(indexStr);
    }
    return 0;
  };
  setNextIndex = async (index: number): Promise<void> => {
    return await this.saveString(NEXT_INDEX, index.toString());
  };
  removeNextIndex = async (): Promise<void> => {
    return await this.remove(NEXT_INDEX);
  };
  getSelectedWallet = async () => {
    return await this.loadObject(SELECTED_WALLET);
  };
  setSelectedWallet = async (wallet: DapperWallet) => {
    return await this.saveObject(SELECTED_WALLET, wallet);
  };
  removeSelectedWallet = async (): Promise<void> => {
    return await this.remove(SELECTED_WALLET);
  };
  getNetwork = async (): Promise<string> => {
    const network = await this.loadString(NETWORK);
    if (!network) return "mainnet";
    return network;
  };
  setNetwork = async (network: Network): Promise<void> => {
    return await this.saveString(NETWORK, network);
  };
  removeNetwork = async (): Promise<void> => {
    return await this.remove(NETWORK);
  };
  getColorScheme = async (): Promise<string> => {
    const colorScheme = await this.loadString(COLOR_SCHEME);
    if (!colorScheme) return "dark";
    return colorScheme;
  };
  setColorScheme = async (colorScheme: ColorScheme): Promise<void> => {
    return await this.saveString(COLOR_SCHEME, colorScheme);
  };
  removeColorScheme = async (): Promise<void> => {
    return await this.remove(COLOR_SCHEME);
  };
  getFaceID = async (): Promise<boolean> => {
    const faceID = await this.loadString(FACE_ID);
    if (!faceID) return true;
    if (faceID === "true") {
      return true;
    } else {
      return false;
    }
  };
  setFaceID = async (faceID: boolean): Promise<void> => {
    if (faceID) {
      return await this.saveString(FACE_ID, "true");
    } else {
      return await this.saveString(FACE_ID, "false");
    }
  };
  removeFaceID = async (): Promise<void> => {
    return await this.remove(FACE_ID);
  };
  saveString = async (key: string, value: string) => {
    try {
      await ExpoSecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(error.message);
    }
  };
  loadString = async (key: string) => {
    const result = await ExpoSecureStore.getItemAsync(key);
    if (!result) return undefined;
    return result;
  };
  saveObject = async (key: string, value: IStringMap<any>): Promise<void> => {
    const jsonValue = JSON.stringify(value);
    await this.saveString(key, jsonValue);
  };
  loadObject = async (key: string): Promise<IStringMap<any>> => {
    const jsonValue = await this.loadString(key);
    if (!jsonValue) return null;
    const objectValue = JSON.parse(jsonValue);
    return objectValue;
  };
  remove = async (key: string): Promise<void> => {
    try {
      await ExpoSecureStore.deleteItemAsync(key);
      console.log(`SecureStore: removed value for key: ${key}`);
    } catch (error) {
      console.warn(error);
    }
  };
}
