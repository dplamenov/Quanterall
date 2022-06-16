// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenMarketplace {
    address payable token;
    uint256 treasure;

    constructor(address _token, uint256 _initialTokenCount) {
        token = payable(_token);
        treasure = _initialTokenCount;
    }

    function buy() public payable {
        IERC20(token).transfer(msg.sender, msg.value * 1000);
    }

    function sell(uint256 tokenToSale) public payable{
        IERC20(token).transferFrom(msg.sender, address(this), tokenToSale);
        payable(msg.sender).transfer(tokenToSale / 1000);
    }
}
