const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  const tokenImage = "https://imgur.com/LUDJSqk"; // Defina o URL da imagem do token aqui
  const smartToken = await SmartToken.deploy(tokenImage); // Adicione o argumento tokenImage
  const token = await Token.deploy();

  console.log("Token address:", token.address);

  // Verifica o saldo de ETH do endereço da conta antes da implantação
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance));

  // Consulta o saldo de ETH da conta associada à rede Mumbai
  const provider = ethers.provider; // Modificação aplicada aqui
  const projectBalance = await provider.getBalance(deployer.address);
  console.log("Project balance:", ethers.utils.formatEther(projectBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
