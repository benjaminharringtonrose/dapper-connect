import { getAddress } from "@ethersproject/address";
import { mnemonicToSeedSync } from "bip39";
import { addHexPrefix } from "ethereumjs-util";
import { hdkey } from "ethereumjs-wallet";

import { secureStore } from "../classes";
import { ALL_WALLETS, DEFAULT_HD_PATH, PEACE_COLORS } from "../constants";
import { setNextIndex } from "../store/wallet/slice";
import { DapperWallet } from "../types";

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
  const nextIndex = await secureStore.getNextIndex();
  const address = await secureStore.getAddress();
  const { privateKey } = await secureStore.getPrivateKey(address);
  const { seedphrase } = await secureStore.getSeedPhrase(privateKey as string);
  const { wallet } = deriveAccountFromMnemonic(seedphrase as string, nextIndex);
  const walletColor = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];
  const walletAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
  const walletPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));
  await secureStore.setNextIndex(nextIndex + 1);
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

export const getSeedphrase = async () => {
  try {
    const address = await secureStore.getAddress();
    const { privateKey } = await secureStore.getPrivateKey(address);
    const { seedphrase } = await secureStore.getSeedPhrase(privateKey as string);
    return seedphrase as string;
  } catch (error) {
    console.warn("getSeedPhraseFromSecureStore Error:", error);
    console.log("getSeedPhraseFromSecureStore Error:", error);
  }
};

export function sanitizeSeedphrase(str: string) {
  // trims extra whitespaces, removes new lines and line breaks
  return str
    .replace(/(\r\n|\n|\r)/gm, " ")
    .trim()
    .split(" ")
    .filter((word) => !!word)
    .join(" ");
}
