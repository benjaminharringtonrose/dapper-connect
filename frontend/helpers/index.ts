import { getAddress } from "@ethersproject/address";
import { mnemonicToSeedSync } from "bip39";
import { addHexPrefix } from "ethereumjs-util";
import { hdkey } from "ethereumjs-wallet";

import {
  ADDRESS,
  ALL_WALLETS,
  COLOR_SCHEME,
  DEFAULT_HD_PATH,
  FACE_ID,
  NETWORK,
  NEXT_INDEX,
  ONBOARDED,
  PEACE_COLORS,
  PRIVATE_KEY,
  privateKeyVersion,
  SEED_PHRASE,
  seedPhraseVersion,
  SELECTED_WALLET,
} from "../constants";
import { setNextIndex } from "../store/wallet/slice";
import { ColorScheme, DapperWallet, Network } from "../types";

import { loadObject, loadString, remove, saveObject, saveString } from "./common";

let store;

export const injectStoreIntoHelpers = (_store) => {
  store = _store;
};

export { loadObject, loadString, remove, saveObject, saveString };

export const getAllWallets = async (): Promise<DapperWallet[]> => {
  const allWallets = await loadString(ALL_WALLETS);
  if (!allWallets) return [];
  const walletsObject: Record<string, DapperWallet> = JSON.parse(allWallets);
  const walletsArray: DapperWallet[] = [];
  for (const [address, wallet] of Object.entries(walletsObject)) {
    walletsArray.push({ ...wallet, address });
  }
  return walletsArray;
};

export const addWallet = async (
  wallet: DapperWallet,
  prevWallets: DapperWallet[]
): Promise<DapperWallet[]> => {
  let walletsObject = {};
  prevWallets?.forEach((wallet) => {
    walletsObject = {
      ...walletsObject,
      [wallet.address]: wallet,
    };
  });
  walletsObject = {
    ...walletsObject,
    [wallet.address as string]: wallet,
  };
  await saveObject(ALL_WALLETS, walletsObject);
  return await getAllWallets();
};

export const removeWallet = async (
  address: string,
  prevWallets: DapperWallet[]
): Promise<DapperWallet[]> => {
  let walletsObject = {};
  prevWallets?.forEach((wallet) => {
    if (wallet.address !== address) {
      walletsObject = {
        ...walletsObject,
        [wallet.address]: wallet,
      };
    }
  });
  await saveObject(ALL_WALLETS, walletsObject);
  return await getAllWallets();
};

export const resetWalletsInSecureStorage = async () => {
  await remove(ALL_WALLETS);
};

export const deriveAccountFromMnemonic = (mnemonic: string, index = 0) => {
  const seed = mnemonicToSeedSync(mnemonic).slice(0, 32);
  const hdWallet = hdkey.fromMasterSeed(seed);
  const root = hdWallet.derivePath(DEFAULT_HD_PATH);
  const child = root.deriveChild(index);
  const wallet = child.getWallet();
  return {
    address: `0x${wallet.getAddress().toString("hex")}`,
    isHDWallet: true,
    root,
    type: "mnemonic",
    wallet,
    walletType: "bip39",
  };
};

export const toChecksumAddress = (address: string): string | null => {
  try {
    return getAddress(address);
  } catch (error) {
    return null;
  }
};

export const createNextWallet = async (name: string) => {
  const nextIndex = await getNextIndexInSecureStorage();
  const address = await getAddressInSecureStorage();
  const { privateKey } = await getPrivateKey(address);
  const { seedPhrase } = await getSeedPhrase(privateKey);
  const { wallet } = deriveAccountFromMnemonic(seedPhrase as string, nextIndex);
  const walletColor = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];
  const walletAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
  const walletPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));
  await saveNextIndex(nextIndex + 1);
  store.dispatch(setNextIndex({ nextIndex: nextIndex + 1 }));
  const nextDapperWallet: DapperWallet = {
    name,
    color: walletColor,
    address: walletAddress,
    privateKey: walletPkey,
    provider: "local",
    primary: false,
  };
  return nextDapperWallet;
};

export const getOnboardStatus = async () => {
  const onboarded = await loadString(ONBOARDED);
  if (onboarded === "true") {
    return true;
  } else {
    return false;
  }
};
export const saveOnboardStatus = async (onboarded: boolean) => {
  await saveString(ONBOARDED, onboarded ? "true" : "false");
};

export const savePrivateKey = async (address: string, privateKey: string) => {
  const key = `${PRIVATE_KEY}_${address}`;
  await saveObject(key, {
    address,
    privateKey,
    version: privateKeyVersion,
  });
};

export const getPrivateKey = async (address: string) => {
  try {
    const pkey = await loadObject(`${PRIVATE_KEY}_${address}`);
    return pkey || undefined;
  } catch (error) {
    console.log("getPrivateKey Error:", error);
    console.warn("getPrivateKey Error:", error);
    return undefined;
  }
};

export const saveSeedPhrase = async (seedphrase: string, privateKey: any): Promise<void> => {
  const key = `${SEED_PHRASE}_${privateKey}`;
  return saveObject(key, {
    privateKey,
    seedphrase,
    version: seedPhraseVersion,
  });
};

export const getSeedPhrase = async (privateKey: any) => {
  try {
    const key = `${SEED_PHRASE}_${privateKey}`;
    const seedPhraseData = await loadObject(key);
    return seedPhraseData || undefined;
  } catch (error) {
    console.log("getSeedPhrase Error:", error);
    console.warn("getSeedPhrase Error:", error);
    return undefined;
  }
};

export const saveAddress = async (address: string): Promise<void> => {
  return saveString(ADDRESS, address);
};

export const getNextIndexInSecureStorage = async () => {
  const indexStr = await loadString(NEXT_INDEX);
  if (indexStr) {
    return Number(indexStr);
  }
  return 0;
};

export const saveNextIndex = async (index: number): Promise<void> => {
  return await saveString(NEXT_INDEX, index.toString());
};

export const getAddressInSecureStorage = async () => {
  return loadString(ADDRESS);
};

export const setSelectedWallet = async (wallet: DapperWallet) => {
  return saveObject(SELECTED_WALLET, wallet as any); // need to figure out this type issue
};

export const getSelectedWallet = async () => {
  try {
    const selectedWallet = await loadObject(SELECTED_WALLET);
    if (selectedWallet) {
      return selectedWallet;
    }
    return undefined;
  } catch (error) {
    console.log("getSelectedWallet Error:", error);
    console.warn("getSelectedWallet Error:", error);
    return undefined;
  }
};

export const getNetwork = async (): Promise<string> => {
  const network = await loadString(NETWORK);
  if (!network) return "mainnet";
  return network;
};

export const setNetworkInSecureStorage = async (network: Network): Promise<void> => {
  return await saveString(NETWORK, network);
};

export const removeNetworkInSecureStorage = async (): Promise<void> => {
  return await remove(NETWORK);
};

export const getColorScheme = async (): Promise<string> => {
  const colorScheme = await loadString(COLOR_SCHEME);
  if (!colorScheme) return "dark";
  return colorScheme;
};

export const setColorSchemeInSecureStorage = async (colorScheme: ColorScheme): Promise<void> => {
  return await saveString(COLOR_SCHEME, colorScheme);
};

export const removeColorSchemeInSecureStorage = async (): Promise<void> => {
  return await remove(COLOR_SCHEME);
};

export const getFaceIDInSecureStorage = async (): Promise<boolean> => {
  const faceID = await loadString(FACE_ID);
  if (!faceID) return true;
  if (faceID === "true") {
    return true;
  } else {
    return false;
  }
};

export const toggleFaceIDInSecureStorage = async (faceID: "true" | "false"): Promise<void> => {
  console.log("faceID", faceID);
  return await saveString(FACE_ID, faceID);
};

export const removeFaceIDInSecureStorage = async (): Promise<void> => {
  return await remove(FACE_ID);
};

export const removePrivateKeyInSecureStorage = async (): Promise<void> => {
  return await remove(PRIVATE_KEY);
};

export const removeAddressInSecureStorage = async (): Promise<void> => {
  return await remove(ADDRESS);
};

export const removeSeedPhraseInSecureStorage = async (): Promise<void> => {
  return await remove(SEED_PHRASE);
};

export const removeSelectedWalletInSecureStorage = async (): Promise<void> => {
  return await remove(SELECTED_WALLET);
};

export const removeOnboardStatusInSecureStorage = async (): Promise<void> => {
  return await remove(ONBOARDED);
};

export const removeNextIndexInSecureStorage = async (): Promise<void> => {
  return await remove(NEXT_INDEX);
};
