// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenMarketplace {
    address payable token;
    uint256 treasure;

    constructor(address _token) {
        token = payable(_token);
    }

    function addLiquidity(uint256 _tokens) public {
        IERC20(token).transferFrom(msg.sender, address(this), _tokens);
    }

    function buy() public payable {
        uint k = address(this).balance * treasure;
        treasure -= k / msg.value;
        IERC20(token).transfer(msg.sender, k / msg.value);
    }

    function sell(uint256 tokenToSale) public payable {
        uint k = address(this).balance * treasure;

        IERC20(token).transferFrom(msg.sender, address(this), tokenToSale);
        payable(msg.sender).transfer(k / tokenToSale);
    }
}
