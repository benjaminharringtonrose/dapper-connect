import constants from "./constants";
import icons from "./icons";
import mockData from "./mock";
import theme, { COLORS, FONTS, SIZES } from "./theme";

export const NETWORK = "NETWORK";
export const COLOR_SCHEME = "COLOR_SCHEME";
export const FACE_ID = "FACE_ID";
export const ALL_WALLETS = "ALL_WALLETS";
export const PRIVATE_KEY = "PRIVATE_KEY";
export const SEED_PHRASE = "SEED_PHRASE";
export const SELECTED_WALLET = "SELECTED_WALLET";
export const ADDRESS = "ADDRESS";
export const ONBOARDED = "ONBOARDED";
export const NEXT_INDEX = "NEXT_INDEX";
export const PASSWORD = "PASSWORD";
export const ACCEPTED_TCS = "ACCEPTED_TCS";

export const privateKeyVersion = 1.0;
export const seedPhraseVersion = 1.0;
export const allWalletsVersion = 1.0;
export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = "My Wallet";
export const PEACE_COLORS = ["blue", "green", "red", "yellow"];

export { constants, mockData, theme, COLORS, SIZES, FONTS, icons };
