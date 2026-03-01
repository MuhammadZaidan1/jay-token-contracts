// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./JayToken.sol";
import "hardhat/console.sol";

contract Vendor {
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfToken);
    event SellTokens(address seller, uint256 amountOfToken, uint256 amountOfETH);
    address public owner;
    JayToken public token;
    uint256 public tokenPerETH = 500;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can access");
        _;
    }

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = JayToken(_tokenAddress);
    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need to send some ETH");
        uint256 amountToBuy = msg.value * tokenPerETH;
        require(token.balanceOf(address(this)) >= amountToBuy, "Vendor has insufficient tokens");
        bool sent = token.transfer(msg.sender, amountToBuy);
        require(sent, "Failed to transfer tokens");
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
    }

    function sellTokens(uint256 tokenAmountToSell) public {
        require(tokenAmountToSell > 0, "Specify an amount of token greater than zero");
        require(token.balanceOf(msg.sender) >= tokenAmountToSell, "Insufficient token balance");
        uint256 amountOfETHToTransfer = tokenAmountToSell / tokenPerETH;
        require(address(this).balance >= amountOfETHToTransfer, "Vendor has not enough ETH funds");
        bool sentToken = token.transferFrom(msg.sender, address(this), tokenAmountToSell);
        require(sentToken, "Failed to transfer tokens from user to vendor");
        (bool sentETH, ) = msg.sender.call{value: amountOfETHToTransfer}("");
        require(sentETH, "Failed to send ETH to the user");
        emit SellTokens(msg.sender, tokenAmountToSell, amountOfETHToTransfer);
    }

    function withdrawETH() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        (bool sent, ) = owner.call{value: balance}("");
        require(sent, "Withdrawal Failed");
    }

    function withdrawTokens() public onlyOwner {
        uint256 tokenBalance = token.balanceOf(address(this));
        require(tokenBalance > 0, "Vendor has no tokens left");
        bool sent = token.transfer(owner, tokenBalance);
        require(sent, "Failed to withdraw tokens");
    }

    receive() external payable {
        buyTokens();
    }
}