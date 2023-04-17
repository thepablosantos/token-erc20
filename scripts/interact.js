const hre = require("hardhat");

async function main() {
  const [addr1, addr2] = await hre.ethers.getSigners();
  const contractAddress = "0x7897B9D8cf778c396600DC15EF209127B4137dF1"; // Manter atualizado o endereço atual do contrato

  // Conectar ao contrato já implantado
  const TokenFactory = await hre.ethers.getContractFactory("SmartToken");
  const token = TokenFactory.attach(contractAddress);
  console.log("Connected to SmartToken at:", contractAddress);

  const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function prompt() {
    return new Promise((resolve) => {
      rl.question("Escolha a função para executar: (mint, approve, transferFrom, pay, withdraw, exit) ", (answer) => {
        resolve(answer);
      });
    });
  }

  let continueExecution = true;

  while (continueExecution) {
    const answer = await prompt();

    if (answer === "mint") {
      await token.connect(addr1).mint('0x6CCc223006507d13e952caB700E4Ba89d675CBDd', hre.ethers.utils.parseUnits("100", 18));
      console.log("Minted 100 tokens to addr1");
    } else if (answer === "approve") {
      await token.connect(addr1).approve(addr2.address, hre.ethers.utils.parseUnits("50", 18));
      console.log("Addr1 approved Addr2 to spend 50 tokens");
    } else if (answer === "transferFrom") {
      await token.connect(addr2).transferFrom(addr1.address, addr2.address, hre.ethers.utils.parseUnits("25", 18));
      console.log("Addr2 transferred 25 tokens from Addr1 to Addr2");
    } else if (answer === "pay") {
      await token.connect(addr1).pay(addr2.address, hre.ethers.utils.parseUnits("10", 18), "payment_proof");
      console.log("Addr1 paid Addr2 10 tokens with payment proof");
    } else if (answer === "withdraw") {
      await token.connect(addr2).withdraw(hre.ethers.utils.parseUnits("5", 18));
      console.log("Addr2 withdrew 5 tokens");
    } else if (answer === "exit") {
      console.log("Exiting...");
      continueExecution = false;
    } else {
      console.log("Comando inválido. Tente novamente.");
    }
  }

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
