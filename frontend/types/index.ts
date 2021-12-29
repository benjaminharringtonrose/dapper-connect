import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  image: any;
  currentPrice: number;
  qty: number;
  total: number;
  priceChangePercentageInCurrency7d: number;
  holdingValueChange7d: number;
  sparklineIn7d: {
    value: any[];
  };
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: 1;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
  sparkline_in_7d: { price: any[] };
  price_change_percentage_7d_in_currency: number;
}

export interface MeasureLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  list?: "coins" | "exchanges";
}

export interface Token {
  balance: number;
  rawBalance: string;
  tokenInfo: {
    address: string;
    coingecko: string;
    decimals: string;
    description: string;
    ethTransferCount: number;
    holdersCount: number;
    image: string;
    issuancesCount: number;
    lastUpdated: number;
    name: string;
    owner: string;
    price: {
      availableSupply: number;
      currency: string;
      diff: number;
      diff30d: number;
      diff7d: number;
      marketCapUsd: number;
      rate: number;
      ts: number;
      volDiff1: number;
      volDiff30: number;
      volDiff7: number;
      volume24h: number;
    };
    publicTags: string[];
    reddit: string;
    slot: number;
    symbol: string;
    telegram: string;
    totalSupply: string;
    twitter: string;
    website: string;
  };
  totalIn: number;
  totalOut: number;
}

export interface Account {
  ETH: {
    balance: number;
    price: {
      availableSupply: number;
      diff: number;
      diff30d: number;
      diff7d: number;
      marketCapUsd: number;
      rate: number;
      ts: number;
      volDiff1: number;
      volDiff30: number;
      volume24h: number;
    };
    rawBalance: string;
  };
  address: string;
  countTxs: 2;
  tokens: Token[];
}

export interface Exchange {
  id: string;
  name: string;
  year_established: number;
  country: string;
  description: string;
  url: string;
  image: string;
  has_trading_incentive: boolean;
  trust_score: number;
  trust_score_rank: number;
  trade_volume_24h_btc: number;
  trade_volume_24h_btc_normalized: number;
}

export interface AuthUser {
  emailVerified?: boolean;
  uid: string;
  providerId?: string;
  providerData: Array<any>;
  displayName?: string;
  email?: string;
  isAnonymous?: boolean;
  photoURL?: string;
  metadata: { creationTime?: string; lastSignInTime?: string };
}

export interface Keystore {
  address: string;
  crypto: {
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
    kdf: string;
    kdfparams: any;
    mac: string;
  };
  id: string;
  version: number;
}

export interface Wallet {
  name?: string;
  address?: string;
  keystore?: Keystore;
  password?: string;
  privateKey?: string;
  provider?: "walletconnect" | "local";
}

export interface User {
  wallets?: Wallet[];
  uid: string;
  email: string;
  createdOn: string;
  providers?: string[];
  messagingTokens?: string[];
  state: "verified" | "unverified";
}
