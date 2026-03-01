// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract JayToken is ERC20 {
    constructor() ERC20("Jay Token", "JAY") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}