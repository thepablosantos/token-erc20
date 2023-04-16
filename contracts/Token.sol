// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Importa contratos de biblioteca do OpenZeppelin para implementação do contrato
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Declaração do contrato Token que herda as funcionalidades dos contratos ERC20, ERC20Burnable e Ownable
contract Token is ERC20, ERC20Burnable, Ownable {
    mapping (address => mapping (address => uint256)) private _authorized;

    uint8 private constant _decimals = 18;
    // Define o limite máximo para a quantidade total de tokens que podem ser emitidos
    uint256 private constant _maxSupply = 1000000 * 10 ** uint256(_decimals);
    string public tokenImage;

    // evento emitido quando uma transferência bem-sucedida ocorre, incluindo o comprovante de pagamento e o timestamp
    event Payment(address indexed sender, address indexed recipient, uint256 amount, string paymentProof, uint256 timestamp);

    constructor() ERC20("Token", "BRL") {
        // Define o balanço inicial do contrato
        _mint(address(this), 500000 * 10 ** _decimals);
        tokenImage = "https://example.com/fictitious_token_image.png";
    }

    // Criação de Tokens
    function mint(address to, uint256 amount) public onlyOwner {
        // Verifica se a quantidade total de tokens que pode ser emitida foi atingida
        require(totalSupply() + amount <= _maxSupply, "Total supply limit exceeded");
        _mint(to, amount);
    }

    // Transferencia *Somente pelo proprietário
    // Essa função é usada para transferir tokens para um endereço de carteira específico.
    // Restringindo o acesso à função transfer apenas ao proprietário do contrato.
    function transfer(address recipient, uint256 amount) public virtual override onlyOwner returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    // Retornar tokens
    // É usada para retornar a quantidade de tokens que um endereço de carteira específico tem permissão para gastar em nome do proprietário dos tokens.
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _authorized[owner][spender];
    }

    // Alterar autorização (allowance)
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    // Função transferFrom adicionada, restrita ao proprietário do contrato
    function transferFrom(address sender, address recipient,     uint256 amount) public virtual override onlyOwner returns (bool) {
        require(_authorized[sender][_msgSender()] >= amount, "ERC20: transfer amount exceeds allowance");
        _transfer(sender, recipient, amount);
        _authorized[sender][_msgSender()] -= amount;
        emit Approval(sender, _msgSender(), _authorized[sender][_msgSender()]);
        return true;
    }

    // Função interna _approve adicionada, com modificador 'override'
    function _approve(address owner, address spender, uint256 amount) internal virtual override {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _authorized[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    // Pagamento com comprovante
    function pay(address recipient, uint256 amount, string memory paymentProof) public returns (bool) {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance"); // verifica se o remetente tem saldo suficiente
        require(transfer(recipient, amount), "Transfer failed"); // transfere os tokens para o destinatário
        uint256 timestamp = block.timestamp; // registra o timestamp atual
        emit Payment(msg.sender, recipient, amount, paymentProof, timestamp); // emite um evento de pagamento bem-sucedido juntamente com o comprovante de pagamento e o timestamp
        return true;
    }

    // Saque de Tokens
    function withdraw(uint256 amount) public returns (bool) {
        // verifica se o remetente tem saldo suficiente
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        // queima (burn) os tokens da carteira do remetente
        _burn(msg.sender, amount);
        return true;
    }

    // Atualizar a variável tokenImage
    function setTokenImage(string memory _tokenImage) public onlyOwner {
        tokenImage = _tokenImage;
    }
}

