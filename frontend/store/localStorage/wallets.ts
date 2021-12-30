import * as SecureStore from "expo-secure-store";

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

export const getAllWallets = async (): Promise<any> => {
  try {
    const allWallets = await SecureStore.getItemAsync(ALL_WALLETS);
    if (!allWallets) return undefined;
    const objectValue = JSON.parse(allWallets);
    return objectValue;
  } catch (error) {
    console.warn(error.message);
    return undefined;
  }
};
