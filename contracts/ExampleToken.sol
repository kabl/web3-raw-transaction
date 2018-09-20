pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract ExampleToken is StandardToken {
    string public name = "ExampleToken"; 
    string public symbol = "EGT";
    uint public decimals = 2;
    uint public INITIAL_SUPPLY = 1000 * (10 ** decimals);

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}