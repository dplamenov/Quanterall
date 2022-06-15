// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NFTToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("NFTToken", "NFTT") {
        _mint(msg.sender, initialSupply);
    }
}
