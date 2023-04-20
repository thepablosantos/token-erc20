<details>
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#example"> Contrato </a>
      <ul>
        <li><a href="#example"> Criação de tokens </a></li>
        <li><a href="#example"> Transferência de tokens </a></li>
        <li><a href="#example"> Gastar tokens em nome do proprietário </a></li>
        <li><a href="#example"> Retornar tokens </a></li>
        <li><a href="#example"> Transferência de tokens por endereço autorizado </a></li>
        <li><a href="#example"> Pagamento com comprovante </a></li>
        <li><a href="#saque-de-tokens"> Saque de tokens </a></li>
      </ul>
    </li>
  </ol>
</details>

## Projeto Token.sol
License: MIT

## Descrição
Este é um projeto de criação de um token através de um smartcontract, que tem como objetivo demonstrar a estrutura padrão de um contrato. Ele é repleto de menções em todo o código explicando cada ponto para que seja de fácil entendimento.

## Sobre
O contrato permite ao proprietário criar (mint) novos tokens e a qualquer usuário queimar (burn) seus próprios tokens.

Transferência de tokens: Os usuários podem transferir tokens para outros endereços.

Pagamento com comprovante: Implementa uma função de pagamento com comprovante, permitindo que os usuários paguem outros endereços com tokens e forneçam um comprovante de pagamento no processo.

Saque de tokens: Os usuários podem retirar (sacar) tokens, queimar seus tokens e, possivelmente, convertê-los em outros ativos ou moeda fiduciária (a conversão não é implementada no contrato).


## Instalação
Para instalar o projeto, siga os passos abaixo:

Clone este repositório em sua máquina local.

Instale as dependências necessárias usando o gerenciador de pacotes de sua preferência.

```
git clone https://github.com/seu-usuario/projeto-x.git
```

cd projeto-x

```
npm install # ou yarn install -y
```

Para verificar se foi instalado corretamente basta executar

```
yarn --version
```

Execute o seguinte comando para instalar o Hardhat:

```
yarn add --dev hardhat
```

## Como utilizar
Dentro do arquivo package.json foi adicionado um script para facilitar na execução do comando de deploy e para a chamada do console. Todos os camando estarão abaixo.

Deploy na Rede Mumbai: 

```
yarn deploy-mumbai
```

Chamar o console:

```
yarn console-mumbai
```

A partir do console é possível fazer as seguintes funções

Implante o contrato:
```
const Token = await ethers.getContractFactory("Token");
const token = await Token.deploy();
await token.deployed();
console.log("Token deployed to:", token.address);
```

Verifique o símbolo e o nome do token:
```
const symbol = await token.symbol();
console.log("Token symbol:", symbol);

const name = await token.name();
console.log("Token name:", name);
```

Verifique o saldo de um endereço:
```
const address = "0x..."; // Substitua pelo endereço desejado
const balance = await token.balanceOf(address);
console.log("Balance:", balance.toString());
```

Crie (mint) novos tokens:
```
const amount = ethers.utils.parseUnits("1000", 18);
const to = "0x..."; // Substitua pelo endereço desejado
await token.mint(to, amount);
```

Transfira tokens para outro endereço:
```
const recipient = "0x..."; // Substitua pelo endereço do destinatário
const transferAmount = ethers.utils.parseUnits("10", 18);
await token.transfer(recipient, transferAmount);
```

Efetue um pagamento com comprovante:
```
const payRecipient = "0x..."; // Substitua pelo endereço do destinatário
const payAmount = ethers.utils.parseUnits("5", 18);
const paymentProof = "Payment proof example";
await token.pay(payRecipient, payAmount, paymentProof);
```

Retire (saque) tokens:
```
const withdrawAmount = ethers.utils.parseUnits("1", 18);
await token.withdraw(withdrawAmount);
```

## Observações

O contrato está sendo executado em uma Metamask existente, as informações da mesma estarão abaixo, você pode criar a sua própria e apenas trocar as informações, criei essa para deixar o contrato rodando e facilitar o trabalho, assim qualquer pessoa pode ir modificando ponto a ponto e ir tentando o contrato para encontrar erros com facilidade se assim existir durante o processo.

## Contribuição
Contribuições são bem-vindas!

## Licença
MIT



