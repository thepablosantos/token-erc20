// Fornece integração com a biblioteca Waffle, que permite testar contratos inteligentes de forma mais fácil, intuitiva.
require("@nomiclabs/hardhat-waffle");
// Permite a verificação do contrato inteligente no Etherscan (serve também para polygonscan)
require("@nomiclabs/hardhat-etherscan");
// Fornece acesso ao objeto ethers, uma biblioteca JavaScript que fornece uma maneira fácil de interagir com a blockchain Ethereum.
require("@nomiclabs/hardhat-ethers");

const {
  privateKey,
  etherscanApiKey,
  polygonscanApiKey,
  urlmumbai,
  rpcUrl,
} = require("./secrets.json");

const chainId = 80001;
const gas = 800000;
const gasPrice = 10000000000;

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.8.18" },
    ],
  },

  // Define as configurações das redes suportadas pelo hardhat
  networks: {
    polygon: {
      url: rpcUrl,
      chainId: chainId,
      gas: gas,
      gasPrice: gasPrice,
      accounts: [`0x${privateKey}`],
    },

    mumbai: {
      url: urlmumbai,
      accounts: [`0x${privateKey}`],
    },
  },

  etherscan: {
    apiKey: etherscanApiKey,
    polygonscan: {
      apiKey: polygonscanApiKey,
      url: "https://api-testnet.polygonscan.com/",
    },
  },
};



