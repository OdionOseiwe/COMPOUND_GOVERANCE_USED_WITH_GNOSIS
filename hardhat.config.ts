import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("hardhat-tracer");

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/0h4KWpjRd3xXNW50By-hTTaZDJnNpjiw",
      }
    }
  }
};

export default config;
