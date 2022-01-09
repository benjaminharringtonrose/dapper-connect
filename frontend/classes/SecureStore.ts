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
import { loadObject, loadString, remove, saveObject, saveString } from "../helpers";
import { ColorScheme, DapperWallet, Network } from "../types";

export class SecureStore {
  resetWallets = async () => {
    await remove(ALL_WALLETS);
  };
  getOnboardStatus = async () => {
    const onboarded = await loadString(ONBOARDED);
    if (onboarded === "true") {
      return true;
    } else {
      return false;
    }
  };
  setOnboardStatus = async (onboarded: boolean) => {
    await saveString(ONBOARDED, onboarded ? "true" : "false");
  };
  removeOnboardStatus = async (): Promise<void> => {
    return await remove(ONBOARDED);
  };
  getAcknowledgements = async () => {
    const acceptedTCs = await loadString(ACCEPTED_TCS);
    if (acceptedTCs === "true") {
      return true;
    } else {
      return false;
    }
  };
  setAcknowledgements = async (acceptedTCs: boolean) => {
    await saveString(ACCEPTED_TCS, acceptedTCs ? "true" : "false");
  };
  removeAcknowledgements = async (): Promise<void> => {
    return await remove(NEXT_INDEX);
  };
  getPrivateKey = async (address: string) => {
    try {
      const obj = await loadObject(`${PRIVATE_KEY}_${address}`);
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
    await saveObject(key, {
      address,
      privateKey,
      version: privateKeyVersion,
    });
  };
  removePrivateKey = async (): Promise<void> => {
    return await remove(PRIVATE_KEY);
  };
  getSeedPhrase = async (privateKey: string) => {
    try {
      const key = `${SEED_PHRASE}_${privateKey}`;
      const obj = await loadObject(key);
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
    return await saveObject(key, {
      privateKey,
      seedPhrase,
      version: seedPhraseVersion,
    });
  };
  removeSeedPhrase = async (privateKey: string): Promise<void> => {
    return await remove(`${SEED_PHRASE}_${privateKey}`);
  };
  getAddress = async () => {
    return await loadString(ADDRESS);
  };
  setAddress = async (address: string): Promise<void> => {
    return await saveString(ADDRESS, address);
  };
  removeAddress = async (): Promise<void> => {
    return await remove(ADDRESS);
  };
  getPassword = async (): Promise<string> => {
    return await loadString(PASSWORD);
  };
  setPassword = async (password: string): Promise<void> => {
    return await saveString(PASSWORD, password);
  };
  removePassword = async (): Promise<void> => {
    return await remove(NEXT_INDEX);
  };
  getNextIndex = async () => {
    const indexStr = await loadString(NEXT_INDEX);
    if (indexStr) {
      return Number(indexStr);
    }
    return 0;
  };
  setNextIndex = async (index: number): Promise<void> => {
    return await saveString(NEXT_INDEX, index.toString());
  };
  removeNextIndex = async (): Promise<void> => {
    return await remove(NEXT_INDEX);
  };
  getSelectedWallet = async () => {
    return await loadObject(SELECTED_WALLET);
  };
  setSelectedWallet = async (wallet: DapperWallet) => {
    return await saveObject(SELECTED_WALLET, wallet as any); // need to figure out this type issue
  };
  removeSelectedWallet = async (): Promise<void> => {
    return await remove(SELECTED_WALLET);
  };
  getNetwork = async (): Promise<string> => {
    const network = await loadString(NETWORK);
    if (!network) return "mainnet";
    return network;
  };
  setNetwork = async (network: Network): Promise<void> => {
    return await saveString(NETWORK, network);
  };
  removeNetwork = async (): Promise<void> => {
    return await remove(NETWORK);
  };
  getColorScheme = async (): Promise<string> => {
    const colorScheme = await loadString(COLOR_SCHEME);
    if (!colorScheme) return "dark";
    return colorScheme;
  };
  setColorScheme = async (colorScheme: ColorScheme): Promise<void> => {
    return await saveString(COLOR_SCHEME, colorScheme);
  };
  removeColorScheme = async (): Promise<void> => {
    return await remove(COLOR_SCHEME);
  };
  getFaceID = async (): Promise<boolean> => {
    const faceID = await loadString(FACE_ID);
    if (!faceID) return true;
    if (faceID === "true") {
      return true;
    } else {
      return false;
    }
  };
  setFaceID = async (faceID: boolean): Promise<void> => {
    if (faceID) {
      return await saveString(FACE_ID, "true");
    } else {
      return await saveString(FACE_ID, "false");
    }
  };
  removeFaceID = async (): Promise<void> => {
    return await remove(FACE_ID);
  };
}
