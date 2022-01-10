import { ETHERSCAN_API_KEY } from "@env";
import { getAddress } from "@ethersproject/address";
import { mnemonicToSeedSync } from "bip39";
import { addHexPrefix } from "ethereumjs-util";
import { hdkey } from "ethereumjs-wallet";

import { secureStore } from "../classes";
import { ALL_ACCOUNTS, DEFAULT_HD_PATH, PEACE_COLORS } from "../constants";
import { setNextIndex } from "../store/wallet/slice";
import { WalletAccount } from "../types";

let store;

export const injectStoreIntoHelpers = (_store) => {
  store = _store;
};

export const getAllAccounts = async (): Promise<WalletAccount[]> => {
  const allAccounts = await secureStore.loadString(ALL_ACCOUNTS);
  if (!allAccounts) return [];
  const accountsObject: Record<string, WalletAccount> = JSON.parse(allAccounts);
  const accountsArray: WalletAccount[] = [];
  for (const [address, wallet] of Object.entries(accountsObject)) {
    accountsArray.push({ ...wallet, address });
  }
  return accountsArray;
};

export const addAccount = async (
  account: WalletAccount,
  prevAccounts: WalletAccount[]
): Promise<WalletAccount[]> => {
  let accountsObject = {};
  prevAccounts?.forEach((account) => {
    accountsObject = {
      ...accountsObject,
      [account.address]: account,
    };
  });
  accountsObject = {
    ...accountsObject,
    [account.address as string]: account,
  };
  await secureStore.saveObject(ALL_ACCOUNTS, accountsObject);
  return await getAllAccounts();
};

export const removeAccount = async (
  address: string,
  prevAccounts: WalletAccount[]
): Promise<WalletAccount[]> => {
  let accountsObject = {};
  prevAccounts?.forEach((wallet) => {
    if (wallet.address !== address) {
      accountsObject = {
        ...accountsObject,
        [wallet.address]: wallet,
      };
    }
  });
  await secureStore.saveObject(ALL_ACCOUNTS, accountsObject);
  return await getAllAccounts();
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

export const createNextAccount = async (name: string) => {
  const nextIndex = await secureStore.getNextIndex();
  const address = await secureStore.getAddress();
  const { privateKey } = await secureStore.getPrivateKey(address);
  const { seedPhrase } = await secureStore.getSeedPhrase(privateKey);
  const { wallet } = deriveAccountFromMnemonic(seedPhrase, nextIndex);
  const accountColor = PEACE_COLORS[Math.floor(Math.random() * PEACE_COLORS.length)];
  const accountAddress = addHexPrefix(toChecksumAddress(wallet.getAddress().toString("hex")));
  const accountPkey = addHexPrefix(wallet.getPrivateKey().toString("hex"));
  await secureStore.setNextIndex(nextIndex + 1);
  store.dispatch(setNextIndex({ nextIndex: nextIndex + 1 }));
  const nextAccount: WalletAccount = {
    name,
    color: accountColor,
    address: accountAddress,
    privateKey: accountPkey,
    provider: "local",
    primary: false,
  };
  return nextAccount;
};

export const getSeedPhrase = async () => {
  try {
    const address = await secureStore.getAddress();
    const { privateKey } = await secureStore.getPrivateKey(address);
    const { seedPhrase } = await secureStore.getSeedPhrase(privateKey);
    return seedPhrase as string;
  } catch (error) {
    console.warn("getSeedPhraseFromSecureStore Error:", error);
    console.log("getSeedPhraseFromSecureStore Error:", error);
  }
};

export function sanitizeSeedPhrase(str: string) {
  // trims extra whitespaces, removes new lines and line breaks
  return str
    .replace(/(\r\n|\n|\r)/gm, " ")
    .trim()
    .split(" ")
    .filter((word) => !!word)
    .join(" ");
}

export const hasPreviousTransactions = async (address: string): Promise<boolean> => {
  try {
    let prevTransactions = false;
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&tag=latest&page=1&offset=1&apikey=${ETHERSCAN_API_KEY}`;
    const response = await fetch(url);
    const parsedResponse = await response.json();
    // Timeout needed to avoid the 5 requests / second rate limit of etherscan API
    setTimeout(() => {
      if (parsedResponse.status !== "0" && parsedResponse.result.length > 0) {
        prevTransactions = true;
      } else {
        prevTransactions = false;
      }
    }, 260);
    return prevTransactions;
  } catch (e) {
    console.log("hasPreviousTransactions Error", e);
    console.warn("hasPreviousTransactions Error", e);
    return false;
  }
};
