const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Marketplace", function () {
  let marketplace;
  let nftToken;
  let nft;
  let owner;
  let addr1;

  beforeEach(async () => {
    const [_owner, _addr1] = await ethers.getSigners();
    owner = _owner;
    addr1 = _addr1;

    const NFTToken = await ethers.getContractFactory("NFTToken");
    nftToken = await NFTToken.deploy("100000000000000000000");
    nftToken.transfer(addr1.address, 10000);
    await nftToken.deployed();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(5, nftToken.address);
    await marketplace.deployed();
  })

  it("Should set correct properties", async function () {
    expect(await marketplace.feeAccount()).to.be.eq(owner.address);
    expect(await marketplace.feePercent()).to.be.eq(5);
    expect(await marketplace.tokenAddress()).to.be.eq(nftToken.address);
  });

  it("mint", async function () {
    expect(await marketplace.itemCount()).to.be.eq(0);

    await marketplace.mint(nft.address, 1);

    expect(await marketplace.itemCount()).to.be.eq(1);

    const item = await marketplace.items(1);

    expect(item.itemId).to.deep.eq(1);
    expect(item.nft).to.deep.eq(nft.address);
    expect(item.tokenId).to.deep.eq(1);
    expect(item.price).to.deep.eq(0);
    expect(item.owner).to.deep.eq(owner.address);
    expect(item.forSale).to.deep.eq(false);
  })

  it("forSale", async function () {
    await nft.mint(1);
    await nft.setApprovalForAll(marketplace.address, true)
    await marketplace.mint(nft.address, 1);
    await marketplace.forSale(nft.address, 150, ethers.BigNumber.from(1));

    const item = await marketplace.items(1);

    expect(item.price).to.deep.eq(150);
    expect(item.forSale).to.deep.eq(true);
  })

  describe('purchaseItem', function () {
    it("purchase item", async function () {
      await nft.mint(1);
      await nft.setApprovalForAll(marketplace.address, true)
      await marketplace.mint(nft.address, 1);
      await marketplace.forSale(nft.address, 150, ethers.BigNumber.from(1));

      await nftToken.connect(addr1).increaseAllowance(marketplace.address, 10000);
      await marketplace.connect(addr1).purchaseItem(1);

      const item = await marketplace.items(1);

      expect(item.owner).to.be.eq(addr1.address);
      expect(item.forSale).to.be.eq(false);
    })

    it("purchase invalid item", async function () {
      await expect(marketplace.connect(addr1).purchaseItem(1)).to.be.revertedWith("item doesn't exist'");
    })
  })

  it('getTotalPrice', async function () {
    await nft.mint(1);
    await nft.setApprovalForAll(marketplace.address, true)
    await marketplace.mint(nft.address, 1);
    await marketplace.forSale(nft.address, 150, ethers.BigNumber.from(1));

    expect(await marketplace.getTotalPrice(1)).to.be.eq("157");
  });
});
