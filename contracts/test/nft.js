const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("NFT", function () {
  let nft;
  let owner;
  let addr1;

  beforeEach(async () => {
    const [_owner, _addr1] = await ethers.getSigners();
    owner = _owner;
    addr1 = _addr1;


    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();
  })

  it("Should set correct properties", async function () {
    expect(await nft.name()).to.be.eq("NFT");
    expect(await nft.symbol()).to.be.eq("NFT");
    expect(await nft.tokenCount()).to.be.eq(0);
  });

  it("should mint", async function() {
    await nft.mint('1');
    expect(await nft.tokenCount()).to.be.eq(1);
  });
});
