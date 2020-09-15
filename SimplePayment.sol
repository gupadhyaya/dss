pragma solidity >=0.5.12;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

interface GemLike {
    function transferFrom(address src, address dst, uint wad) external returns (bool);
}

contract SimplePayment {
    using SafeMath for uint256;
    uint256 constant ONE = 10**18;
    mapping (address => uint256) private _balances;
    mapping (address => uint) public wards;
    function rely(address guy) external auth { wards[guy] = 1; }
    function deny(address guy) external auth { wards[guy] = 0; }
    modifier auth {
        require(wards[msg.sender] == 1, "SimplePayment/not-authorized");
        _;
    }
    GemLike public gem;

    constructor(address gem_) public {
        wards[msg.sender] = 1;
        gem = GemLike(gem_);
    }

    // return gems and get back ones
    function withdraw(uint256 amount) public {
        require(amount <= _balances[msg.sender], "SimplePayment/in-sufficient-balance");
        uint256 gems = SafeMath.div(amount, ONE);
        require(gem.transferFrom(msg.sender, address(this), gems), "SimplePayment/could-not-transfer-gems");
        msg.sender.transfer(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
    }

    // deposit ones and get gems
    function deposit(uint256 amount) payable public {
        require(msg.value >= amount, "SimplePayment/could-not-withdraw");
        uint256 remaining = SafeMath.sub(msg.value, amount);
        msg.sender.transfer(remaining);
        uint256 gems = SafeMath.div(amount, ONE);
        require(gem.transferFrom(address(this), msg.sender, gems), "SimplePayment/could-not-transfer-gems");
        _balances[msg.sender] = _balances[msg.sender].add(amount);
    }

    function close() public auth {
        msg.sender.transfer(address(this).balance);
    }
}