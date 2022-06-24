const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("NFTToken", function () {
  let nftToken;

  beforeEach(async () => {
    const NFTToken = await ethers.getContractFactory("NFTToken");
    nftToken = await NFTToken.deploy("10000000000000000");
    await nftToken.deployed();
  })

  it("Should set correct properties", async function () {
    expect(await nftToken.name()).to.be.eq("NFTToken");
    expect(await nftToken.symbol()).to.be.eq("NFTT");
    expect(await nftToken.totalSupply()).to.be.eq("10000000000000000");
  });
});
