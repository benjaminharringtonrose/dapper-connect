/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { KOVAN_API, MAINNET_API } from "@env";

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    mainnet: {
      provider: function () {
        return new HDWalletProvider(mnemonic, MAINNET_API);
      },
      network_id: 3,
    },
    kovan: {
      provider: function () {
        return new HDWalletProvider(mnemonic, KOVAN_API);
      },
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: "0.7.6", // ex:  "0.4.20". (Default: Truffle's installed solc)
    },
  },
};
