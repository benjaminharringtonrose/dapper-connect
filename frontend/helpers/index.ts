import { getAddress } from "@ethersproject/address";
import { mnemonicToSeedSync } from "bip39";
import { hdkey } from "ethereumjs-wallet";

import {
  ADDRESS,
  ALL_WALLETS,
  DEFAULT_HD_PATH,
  NEXT_INDEX,
  ONBOARDED,
  PRIVATE_KEY,
  privateKeyVersion,
  SEED_PHRASE,
  seedPhraseVersion,
  SELECTED_WALLET,
} from "../constants";
import { DapperWallet } from "../types";

import { loadObject, loadString, remove, saveObject, saveString } from "./common";

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

export const resetWalletsInLocalStorage = async () => {
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

export const getNextIndexInDeviceStorage = async () => {
  const indexStr = loadString(NEXT_INDEX);
  return Number(indexStr);
};

export const saveNextIndex = async (index: number): Promise<void> => {
  return saveString(NEXT_INDEX, index.toString());
};

export const getAddressInDeviceStorage = async () => {
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
