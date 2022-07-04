// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TokenMarketplace.sol";
import "hardhat/console.sol";

contract CDP {
    struct Vault {
        uint256 collateral;
        uint256 debt;
    }

    uint256 private constant ratio = 75e16;

    mapping(address => Vault) vaults;
    address payable public token;
    TokenMarketplace private tokenMarketplace;

    constructor(address _token, address _tokenMarketplace) {
        token = payable(_token);
        tokenMarketplace = TokenMarketplace(_tokenMarketplace);
    }

    function deposit(uint256 amountToDeposit) public payable {
        require(amountToDeposit == msg.value, "incorrect ETH amount");
        uint256 amountToMint = estimateTokenAmount(amountToDeposit);
        IERC20(token).transfer(msg.sender, amountToMint);
        vaults[msg.sender].collateral += amountToDeposit;
        vaults[msg.sender].debt += amountToMint;
    }

    function withdraw(uint256 repaymentAmount) public payable {
        require(
            repaymentAmount <= vaults[msg.sender].debt,
            "withdraw limit exceeded"
        );
        uint256 amountToWithdraw = repaymentAmount / getEthUSDPrice();
        IERC20(token).transferFrom(msg.sender, address(this), repaymentAmount);
        vaults[msg.sender].collateral -= amountToWithdraw;
        vaults[msg.sender].debt -= repaymentAmount;
        payable(msg.sender).transfer(amountToWithdraw);
    }

    function getVault(address userAddress)
    external
    view
    returns (Vault memory vault)
    {
        return vaults[userAddress];
    }

    function estimateCollateralAmount(uint256 repaymentAmount, address user)
    external
    view
    returns (uint256 collateralAmount)
    {
        uint256 collateral = vaults[user].collateral;
        uint256 calculated = (((repaymentAmount * 1e18) / getTokenPrice()) *
        1e18) / ratio;
        return calculated > collateral ? collateral : calculated;
    }

    function estimateTokenAmount(uint256 depositAmount)
    public
    view
    returns (uint256 tokenAmount)
    {
        tokenAmount =
        ((depositAmount * getTokenPrice()) * ratio) /
        1e18 /
        1e18;
    }

    function getTokenPrice() public view returns (uint256) {
        uint tokenMarketplaceBalance = tokenMarketplace.getBalance();
        uint tokenMarketplaceTokenBalance = tokenMarketplace.getBalanceOfTokens();

        uint k = tokenMarketplaceBalance * tokenMarketplaceTokenBalance;
        return (k / (tokenMarketplaceBalance - 10 ** 18) - tokenMarketplaceTokenBalance);
    }
}
