export const getError = (error: Error) => {
  return {
    name: error.name,
    stack: error.stack,
    message: error.message,
  };
};

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
