import { COLORS } from "../constants";
import { Coin, PriceChangePerc } from "../types";

export const getError = (error: Error) => {
  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  };
};

export const CurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const getTokenIdBySymbol = (symbol: string) => {
  // This function maps the token symbol from ethplorer api
  // to the coin gecko id prop so we can get coin gecko token data
  if (caseInsensitiveEquals(symbol, "link")) {
    return "chainlink";
  } else if (caseInsensitiveEquals(symbol, "usdt")) {
    return "tether";
  } else if (caseInsensitiveEquals(symbol, "dai")) {
    return "dai";
  } else if (caseInsensitiveEquals(symbol, "bnb")) {
    return "binancecoin";
  } else if (caseInsensitiveEquals(symbol, "usdc")) {
    return "usd-coin";
  } else if (caseInsensitiveEquals(symbol, "shib")) {
    return "shiba-inu";
  } else if (caseInsensitiveEquals(symbol, "matic")) {
    return "matic-network";
  } else if (caseInsensitiveEquals(symbol, "cro")) {
    return "crypto-com-chain";
  } else if (caseInsensitiveEquals(symbol, "busd")) {
    return "binance-usd";
  } else if (caseInsensitiveEquals(symbol, "wbtc")) {
    return "wrapped-bitcoin";
  } else if (caseInsensitiveEquals(symbol, "ust")) {
    return "terrausd";
  } else if (caseInsensitiveEquals(symbol, "uni")) {
    return "uniswap";
  } else if (caseInsensitiveEquals(symbol, "trx")) {
    return "tron";
  } else if (caseInsensitiveEquals(symbol, "okb")) {
    return "okb";
  } else if (caseInsensitiveEquals(symbol, "ftm")) {
    return "fantom";
  } else if (caseInsensitiveEquals(symbol, "steth")) {
    return "staked-ether";
  } else if (caseInsensitiveEquals(symbol, "vet")) {
    return "vechain";
  } else if (caseInsensitiveEquals(symbol, "sand")) {
    return "the-sandbox";
  } else if (caseInsensitiveEquals(symbol, "theta")) {
    return "theta-token";
  } else if (caseInsensitiveEquals(symbol, "mim")) {
    return "magic-internet-money";
  } else {
    return "NOT_FOUND";
  }
};

function caseInsensitiveEquals(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;
}

export const getPriceChangePercentageInCurrency = (coin: Coin, selectedNumDays: string) => {
  switch (selectedNumDays) {
    case "1":
      return coin?.price_change_percentage_24h_in_currency;
    case "7":
      return coin?.price_change_percentage_7d_in_currency;
    case "30":
      return coin?.price_change_percentage_30d_in_currency;
    case "365":
      return coin?.price_change_percentage_1y_in_currency;
    default:
      return undefined;
  }
};

export const getPriceChangePercentage = (coin: Coin, priceChangePerc: PriceChangePerc) => {
  switch (priceChangePerc) {
    case PriceChangePerc.oneDay:
      return coin?.price_change_percentage_24h_in_currency;
    case PriceChangePerc.oneWeek:
      return coin?.price_change_percentage_7d_in_currency;
    case PriceChangePerc.oneMonth:
      return coin?.price_change_percentage_30d_in_currency;
    case PriceChangePerc.oneYear:
      return coin?.price_change_percentage_1y_in_currency;
    default:
      return undefined;
  }
};

export const getPriceColor = (
  priceChangePercentage: number,
  colors: ReactNativePaper.ThemeColors
) => {
  if (priceChangePercentage === 0) {
    return colors.textGray;
  } else if (priceChangePercentage > 0) {
    return colors.success;
  } else {
    return colors.error;
  }
};
