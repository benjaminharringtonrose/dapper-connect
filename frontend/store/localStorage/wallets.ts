import * as SecureStore from "expo-secure-store";

import { store } from "..";
import { Wallet } from "../../types";

import { ALL_WALLETS } from "./constants";

async function saveString(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn(error.message);
  }
}

async function loadString(key: string) {
  const result = await SecureStore.getItemAsync(key);
  if (!result) return undefined;
  return result;
}

export async function saveObject(key: string, value: Record<string, unknown>): Promise<void> {
  const jsonValue = JSON.stringify(value);
  saveString(key, jsonValue);
}

export async function loadObject(key: string): Promise<Record<string, unknown>> {
  const jsonValue = await loadString(key);
  if (!jsonValue) return null;
  const objectValue = JSON.parse(jsonValue);
  return objectValue;
}

export async function remove(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Keychain: removed value for key: ${key}`);
  } catch (error) {
    console.warn(error);
  }
}

export const getAllWallets = async (): Promise<Wallet[]> => {
  try {
    const allWallets = await SecureStore.getItemAsync(ALL_WALLETS);
    if (!allWallets) return [];
    const walletsObject: Record<string, any> = JSON.parse(allWallets);
    const walletsArray = [];
    for (const [address, wallet] of Object.entries(walletsObject)) {
      walletsArray.push({ ...wallet, address });
    }
    return walletsArray;
  } catch (error) {
    return [];
  }
};

export const addWallet = async ({
  wallet,
  prevWallets,
}: {
  wallet: any;
  prevWallets: any;
}): Promise<Wallet[]> => {
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

// export const removeWallet = async ({ wallet }: { wallet: any }): Promise<Wallet[]> => {
//   const allWallets = await SecureStore.getItemAsync(ALL_WALLETS);

// }

export const resetWallet = async () => {
  await SecureStore.deleteItemAsync(ALL_WALLETS);
};

const kjsdf = [
  {
    address: "0x950083f43c36de91Ed491188d9Af984852C357eA",
    name: "WalletConnect",
    provider: "walletconnect",
  },
  {
    address: "0x190304351d19C239E81f02373F8f54ebF39F1F2D",
    keystore: {
      address: "190304351d19c239e81f02373f8f54ebf39f1f2d",
      crypto: [Object],
      id: "04bdc05e-89ff-4a56-9673-5b8d50209e68",
      version: 3,
    },
    name: "new",
    password: "0x49cb0a94d237312122e8ce14537d96b7d9960cd3f344af894fe82ac573b2f31b",
    privateKey: "0x76173fab015d8ed7cd2c8affb67855e2658fc6d548957bb2e400228e9f97ecd0",
    provider: "local",
  },
];
