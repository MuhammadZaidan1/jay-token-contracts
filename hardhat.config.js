import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; // Versi ESM untuk dotenv

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.20", // Pastikan versi ini sama atau lebih tinggi dari contract lu
  networks: {
    // Network lokal untuk testing cepat (npx hardhat node)
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // Network testnet untuk simulasi realitas
    sepolia: {
      url: process.env.INFURA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] 
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;