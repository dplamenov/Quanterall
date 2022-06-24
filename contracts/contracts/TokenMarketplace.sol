// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract TokenMarketplace is ERC20 {
    address payable token;
    uint256 public treasure;

    constructor(address _token) ERC20("TokenMarketplace", "TM"){
        token = payable(_token);
    }

    function addLiquidity(uint256 _tokens) public payable {
        require(msg.value >= 0.2 ether, "should provide minimum 0.2 ethers");
        IERC20(token).transferFrom(msg.sender, address(this), _tokens);

        treasure += _tokens;

        if (treasure - _tokens == 0) {
            _mint(msg.sender, 10 * 10 ** 18);
        } else {
            uint256 currentSupply = totalSupply();
            uint256 newSupplyForEthers = (address(this).balance * currentSupply) / (address(this).balance - msg.value);
            uint256 newSupplyForTokens = (treasure * currentSupply) / (treasure - _tokens);
            uint256 newSupply = Math.min(newSupplyForEthers, newSupplyForTokens);

            _mint(msg.sender, newSupply - currentSupply);
        }
    }

    function buy() public payable {
        uint256 k = (address(this).balance - msg.value) * treasure;
        uint256 newReserve = k / address(this).balance;

        IERC20(token).transfer(msg.sender, treasure - newReserve);
        treasure -= treasure - newReserve;
    }

    function sell(uint256 tokenToSale) public payable {
        uint256 k = (address(this).balance - msg.value) * treasure;
        uint256 newReserve = k / (treasure + tokenToSale);

        IERC20(token).transferFrom(msg.sender, address(this), tokenToSale);
        payable(msg.sender).transfer(address(this).balance - newReserve);
        treasure += tokenToSale;
    }

    function removeLiquidity(uint256 _tokens) public payable {
        transfer(address(this), _tokens);

        IERC20(token).transfer(msg.sender, treasure * (_tokens / (10 * 10 ** 18)));
        payable(msg.sender).transfer(address(this).balance * (_tokens / (10 * 10 ** 18)));

        _burn(address(this), _tokens);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalanceOfTokens() public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
