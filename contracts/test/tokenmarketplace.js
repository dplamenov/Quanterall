const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("TokenMarketplace", function () {
  let tokenMarketplace;
  let nftToken;

  beforeEach(async () => {
    const NFTToken = await ethers.getContractFactory("NFTToken");
    nftToken = await NFTToken.deploy("10000000000000000");
    await nftToken.deployed();

    const TokenMarketplace = await ethers.getContractFactory("TokenMarketplace");
    tokenMarketplace = await TokenMarketplace.deploy(nftToken.address);
    await tokenMarketplace.deployed();
  })

  it("Should set correct properties", async function () {
    expect(await tokenMarketplace.treasure()).to.be.eq(0);
  });

  it('addLiquidity', async function() {
    await nftToken.increaseAllowance(tokenMarketplace.address, 2000);
    await tokenMarketplace.addLiquidity(2000, {value: ethers.utils.parseEther("1")});
  });
});
