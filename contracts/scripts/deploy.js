// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = require("ethers");
const fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTToken = await hre.ethers.getContractFactory("NFTToken");
  const nftToken = await NFTToken.deploy(ethers.BigNumber.from("10000000000000000000000"));

  await nftToken.deployed();

  console.log("NFTToken deployed to:", nftToken.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(5, nftToken.address);

  await marketplace.deployed();

  console.log("Marketplace deployed to:", marketplace.address);

  const NFTTokenABI = JSON.parse(fs.readFileSync('artifacts/contracts/NFTToken.sol/NFTToken.json', {encoding: 'utf-8'})).abi;
  const NFTABI = JSON.parse(fs.readFileSync('artifacts/contracts/NFT.sol/NFT.json', {encoding: 'utf-8'})).abi;
  const MarketplaceABI = JSON.parse(fs.readFileSync('artifacts/contracts/Marketplace.sol/Marketplace.json', {encoding: 'utf-8'})).abi;

  fs.writeFileSync('../frontend/src/contracts/NFTTokenABI.json', JSON.stringify(NFTTokenABI));
  fs.writeFileSync('../frontend/src/contracts/NFTABI.json', JSON.stringify(NFTABI));
  fs.writeFileSync('../frontend/src/contracts/MarketplaceABI.json', JSON.stringify(MarketplaceABI));

  fs.writeFileSync('../frontend/src/contracts/contracts.json', JSON.stringify({
    NFTToken: nftToken.address,
    NFT: nft.address,
    Marketplace: marketplace.address
  }));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
