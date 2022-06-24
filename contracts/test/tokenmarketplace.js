const {expect} = require("chai");
const {ethers, waffle} = require("hardhat");

describe("TokenMarketplace", function () {
  const provider = waffle.provider;

  let tokenMarketplace;
  let nftToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFTToken = await ethers.getContractFactory("NFTToken");
    nftToken = await NFTToken.deploy(ethers.utils.parseEther("50"));
    await nftToken.deployed();

    const TokenMarketplace = await ethers.getContractFactory("TokenMarketplace");
    tokenMarketplace = await TokenMarketplace.deploy(nftToken.address);
    await tokenMarketplace.deployed();

    await nftToken.transfer(addr1.address, ethers.utils.parseEther("1"));
    await nftToken.transfer(addr2.address, ethers.utils.parseEther("1"));
  })

  it("Should set correct properties", async function () {
    expect(await tokenMarketplace.treasure()).to.be.eq(0);
    expect(await tokenMarketplace.getBalance()).to.be.eq(0);
    expect(await tokenMarketplace.getBalanceOfTokens()).to.be.eq(0);
    expect(await tokenMarketplace.name()).to.be.eq("TokenMarketplace");
    expect(await tokenMarketplace.symbol()).to.be.eq("TM");
    expect(await tokenMarketplace.totalSupply()).to.be.eq("0");
  });

  describe('addLiquidity', function () {
    it('minimum', async function () {
      await nftToken.increaseAllowance(tokenMarketplace.address, 2000);
      expect(tokenMarketplace.addLiquidity(2000, {value: ethers.utils.parseEther("0.1")})).to.be.revertedWith("should provide minimum 0.2 ethers");
    });

    it('addLiquidity for first time', async function () {
      await nftToken.increaseAllowance(tokenMarketplace.address, 2000);
      await tokenMarketplace.addLiquidity(2000, {value: ethers.utils.parseEther("1")});
      expect(await tokenMarketplace.balanceOf(owner.address)).to.be.eq(ethers.utils.parseEther("10"));
    });

    it('addLiquidity with other account', async function () {
      await nftToken.increaseAllowance(tokenMarketplace.address, 2000);
      await tokenMarketplace.addLiquidity(2000, {value: ethers.utils.parseEther("1")});
      expect(await tokenMarketplace.balanceOf(owner.address)).to.be.eq(ethers.utils.parseEther("10"));

      await nftToken.connect(addr1).increaseAllowance(tokenMarketplace.address, 2000);
      await tokenMarketplace.connect(addr1).addLiquidity(2000, {value: ethers.utils.parseEther("1")});

      expect(await tokenMarketplace.balanceOf(owner.address)).to.be.eq(ethers.utils.parseEther("10"));
      expect(await tokenMarketplace.balanceOf(addr1.address)).to.be.eq(ethers.utils.parseEther("10"));

      await nftToken.connect(addr2).increaseAllowance(tokenMarketplace.address, 1500);
      await tokenMarketplace.connect(addr2).addLiquidity(1500, {value: ethers.utils.parseEther("1")});

      expect(await tokenMarketplace.balanceOf(owner.address)).to.be.eq(ethers.utils.parseEther("10"));
      expect(await tokenMarketplace.balanceOf(addr1.address)).to.be.eq(ethers.utils.parseEther("10"));
      expect(await tokenMarketplace.balanceOf(addr2.address)).to.be.eq(ethers.utils.parseEther("7.5"));

    });
  });

  it('buy', async function () {
    await nftToken.increaseAllowance(tokenMarketplace.address, ethers.utils.parseEther("10"));
    await tokenMarketplace.addLiquidity(ethers.utils.parseEther("5"), {value: ethers.utils.parseEther("1.5")});
    await tokenMarketplace.buy({value: ethers.utils.parseEther("1")});
    expect(await nftToken.balanceOf(owner.address)).to.be.eq("45000000000000000000");

    await tokenMarketplace.buy({value: ethers.utils.parseEther("0.3")});
    expect(await nftToken.balanceOf(owner.address)).to.be.eq("45321428571428571429");
  });

  it('sell', async function () {
    await nftToken.increaseAllowance(tokenMarketplace.address, ethers.utils.parseEther("10"));
    await tokenMarketplace.addLiquidity(ethers.utils.parseEther("5"), {value: ethers.utils.parseEther("1.5")});
    await tokenMarketplace.buy({value: ethers.utils.parseEther("0.5")});

    await nftToken.increaseAllowance(tokenMarketplace.address, ethers.utils.parseEther("0.5"));

    const balanceBefore = await provider.getBalance(owner.address);
    await tokenMarketplace.sell(ethers.utils.parseEther("0.5"));

    expect(await nftToken.balanceOf(owner.address)).to.be.eq(ethers.utils.parseEther("43.75"));
    expect(await provider.getBalance(owner.address)).to.be.eq(balanceBefore.add(ethers.utils.parseEther("0.235294117646996203")));
  });

  it('removeLiquidity', async function () {
    await nftToken.increaseAllowance(tokenMarketplace.address, 2000);
    await tokenMarketplace.addLiquidity(2000, {value: ethers.utils.parseEther("1")});

    const tokensBefore = await nftToken.balanceOf(owner.address);
    const etherBefore = await provider.getBalance(owner.address);

    await tokenMarketplace.removeLiquidity(await tokenMarketplace.balanceOf(owner.address));

    const tokensAfter = await nftToken.balanceOf(owner.address);
    const etherAfter = await provider.getBalance(owner.address);

    expect(tokensAfter.sub(tokensBefore)).to.be.eq(2000);
    expect(etherAfter.sub(etherBefore)).to.be.eq(ethers.utils.parseEther("0.999999999999929051"));

  });
});
