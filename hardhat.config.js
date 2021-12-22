/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0xa37e16ec09e4bababa41b124a0b197a8c6900c37de916e60629908c359fde180","balance":"1000000000000000000000"},{"privateKey":"0xdf578afc4e2a8b7533ccda5af2af586ebef0084c332b241d3be4edbe03ea66f8","balance":"1000000000000000000000"},{"privateKey":"0xd14f3cc1a136ac7f2cb85c590be85a38e6827acadc0b52fbacf6b889b725e40c","balance":"1000000000000000000000"},{"privateKey":"0x0dd75733333de419dce8337d2e7fc4a01ff8314de9bdee53335e5ec31286d612","balance":"1000000000000000000000"},{"privateKey":"0x515664a0a7792448d53669d520b87155f5ac7de63b57605f83ca76b93016e6f7","balance":"1000000000000000000000"},{"privateKey":"0xb823d4c71d8a919b71ccddffc00e3ad0d9ad1adca1c3d92cfdb9678e503ad5d0","balance":"1000000000000000000000"},{"privateKey":"0xdab4f7c3302479141e1f12338a57c4304487e61343d6089849a07acf6c07618e","balance":"1000000000000000000000"},{"privateKey":"0x82997e49afc733066108afe14c436bd950da9a27a18f47f8bb17509fe5867287","balance":"1000000000000000000000"},{"privateKey":"0xeed3e0a8a89456a270f6cf819947ea15d353b4509c2a703ebd5192968c7bdeb4","balance":"1000000000000000000000"},{"privateKey":"0xee998792d3b5f96cd727f4340ce1e5588707a2e83772c1c32cb1760c0853efa6","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};