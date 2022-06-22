// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenMarketplace {
    using SafeMath for uint256;

    address payable token;
    uint256 public treasure;

    constructor(address _token) {
        token = payable(_token);
    }

    function addLiquidity(uint256 _tokens) public payable{
        IERC20(token).transferFrom(msg.sender, address(this), _tokens);
        treasure += _tokens;
    }

    function buy() public payable {
        uint256 k = address(this).balance * treasure;
        treasure -= msg.value / k;
        IERC20(token).transfer(msg.sender, msg.value / k);
    }

    function sell(uint256 tokenToSale) public payable {
        uint k = address(this).balance * treasure;

        IERC20(token).transferFrom(msg.sender, address(this), tokenToSale);
        payable(msg.sender).transfer(k / tokenToSale);
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getBalanceOfTokens() public view returns(uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
