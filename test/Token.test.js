// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
  let Token, token, owner, addr1, addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy();
    await token.deployed();
  });

  describe("Deployment", function () {
    // Teste para verificar se o proprietário do contrato é definido corretamente
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    // Teste para verificar se o fornecimento total de tokens é atribuído ao contrato
    it("Should assign the total supply of tokens to the contract", async function () {
      const totalSupply = await token.totalSupply();
      expect(await token.balanceOf(token.address)).to.equal(totalSupply);
    });
  });

  describe("Transactions", function () {
    // Teste para verificar se as transferências de tokens entre contas funcionam corretamente
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 50);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await token.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    // Teste para verificar se a transferência falha quando o remetente não tem tokens suficientes
    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("revert ERC20: transfer amount exceeds balance");

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Approve & TransferFrom", function () {
    // Teste para verificar se os saldos são atualizados após as transferências usando o método transferFrom
    it("Should update balances after transfers", async function () {
      await token.approve(addr1.address, 100);
      await token.connect(addr1).transferFrom(owner.address, addr2.address, 100);

      expect(await token.balanceOf(owner.address)).to.equal(0);
      expect(await token.balanceOf(addr2.address)).to.equal(100);
    });

    // Teste para verificar se as permissões são atualizadas após as transferências usando o método transferFrom
    it("Should update allowances after transfers", async function () {
      await token.approve(addr1.address, 100);
      await token.connect(addr1).transferFrom(owner.address, addr2.address, 100);

      expect(await token.allowance(owner.address, addr1.address)).to.equal(0);
    });

    // Teste para verificar se a transferência falha quando não há permissão suficiente
    it("Should fail if there is not enough allowance", async function () {
      await token.approve(addr1.address, 99);
      await expect(
        token.connect(addr1).transferFrom(owner.address, addr2.address, 100)
      ).to.be.revertedWith("revertERC20: transfer amount exceeds allowance");
    });
   });
    
    describe("Payment", function () {
    // Teste para verificar se um evento de pagamento é emitido com os dados corretos
    it("Should emit a Payment event with the correct data", async function () {
    await token.transfer(addr1.address, 50);
    await expect(
        token.connect(addr1).pay(addr2.address, 50, "payment_proof")
      )
        .to.emit(token, "Payment")
        .withArgs(addr1.address, addr2.address, 50, "payment_proof");
    });
});

describe("Minting", function () {
// Teste para verificar se a cunhagem de tokens é realizada corretamente
it("Should mint tokens correctly", async function () {
await token.mint(owner.address, 1000);
expect(await token.balanceOf(owner.address)).to.equal(1000);
});
// Teste para verificar se a cunhagem falha quando excederia o fornecimento máximo
it("Should fail if minting would exceed max supply", async function () {
    await expect(token.mint(owner.address, 1000000 * 10 ** 18)).to.be.revertedWith("Total supply limit exceeded");
  });
});

describe("Withdraw", function () {
// Teste para verificar se a retirada de tokens é realizada corretamente
it("Should withdraw tokens correctly", async function () {
await token.transfer(addr1.address, 1000);
const initialAddr1Balance = await token.balanceOf(addr1.address);
await token.connect(addr1).withdraw(500);
const finalAddr1Balance = await token.balanceOf(addr1.address);
expect(initialAddr1Balance - finalAddr1Balance).to.equal(500);
});

// Teste para verificar se a retirada falha ao tentar retirar mais tokens do que o saldo
it("Should fail if withdrawing more tokens than the balance", async function () {
  await token.transfer(addr1.address, 1000);
  await expect(token.connect(addr1).withdraw(2000)).to.be.revertedWith("Insufficient balance");
});
});

describe("Token Image", function () {
// Teste para verificar se a imagem inicial do token é definida
it("Should set the initial token image", async function () {
expect(await token.tokenImage()).to.equal("https://example.com/fictitious_token_image.png");
});
// Teste para verificar se a imagem do token é atualizada corretamente
it("Should update the token image", async function () {
    await token.setTokenImage("https://new_token_image.com");
    expect(await token.tokenImage()).to.equal("https://new_token_image.com");
  });
  
  // Teste para verificar se usuários não-proprietários não podem atualizar a imagem do token
  it("Should not allow non-owner to update the token image", async function () {
    await expect(token.connect(addr1).setTokenImage("https://new_token_image.com")).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
});  
