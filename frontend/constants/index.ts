import icons from "./icons";
import theme, { COLORS, FONTS, SIZES } from "./theme";

export const NETWORK = "NETWORK";
export const COLOR_SCHEME = "COLOR_SCHEME";
export const FACE_ID = "FACE_ID";
export const ALL_ACCOUNTS = "ALL_ACCOUNTS";
export const PRIVATE_KEY = "PRIVATE_KEY";
export const SEED_PHRASE = "SEED_PHRASE";
export const SELECTED_ACCOUNT = "SELECTED_ACCOUNT";
export const ADDRESS = "ADDRESS";
export const ONBOARDED = "ONBOARDED";
export const NEXT_INDEX = "NEXT_INDEX";
export const PASSWORD = "PASSWORD";
export const ACCEPTED_TCS = "ACCEPTED_TCS";

export const privateKeyVersion = 1.0;
export const seedPhraseVersion = 1.0;
export const allWalletsVersion = 1.0;
export const DEFAULT_HD_PATH = `m/44'/60'/0'/0`;
export const DEFAULT_WALLET_NAME = "Account 1";
export const PEACE_COLORS = ["blue", "green", "red", "yellow"];

export const TOKENS = [
  {
    id: "tether",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    decimals: 6,
    website: "https://tether.to/",
  },
  {
    id: "chainlink",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    decimals: 18,
    website: "https://chain.link/",
  },
  {
    id: "dai",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    website: "https://makerdao.com/",
  },
  {
    id: "polygon",
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    decimals: 18,
    website: "https://polygon.technology/",
  },
  {
    id: "shiba-inu",
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    decimals: 18,
    website: "https://shibatoken.com/",
  },
  {
    id: "binance-usd",
    address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
    decimals: 18,
    website: "http://www.paxos.com/busd",
  },
];

export { theme, COLORS, SIZES, FONTS, icons };
