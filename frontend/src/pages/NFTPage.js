import {Typography, Button} from '@mui/material';
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import marketplaceABI from "../contracts/MarketplaceABI.json";
import {useEffect, useState} from "react";
import NFTABI from "../contracts/NFTABI.json";
import {useParams} from "react-router";
import * as React from "react";

function NFTPage() {
  const signer = useSelector(state => state.web3.signer);

  const marketplace = new ethers.Contract(contracts.Marketplace, marketplaceABI, signer);
  const nft = new ethers.Contract(contracts.NFT, NFTABI, signer);
  const [item, setItem] = useState();

  const params = useParams();

  const load = async (index) => {
    const i = await marketplace.items(index);
    const uri = await nft.tokenURI(i.tokenId);
    const response = await fetch(uri);
    const metadata = await response.json();
    const totalPrice = await marketplace.getTotalPrice(i.itemId);

    return {
      totalPrice,
      price: i.price,
      itemId: i.itemId,
      title: metadata.title,
      description: metadata.description,
      image: metadata.image
    }
  };

  useEffect(() => {
    load(+params.id).then(nft => {
      setItem(nft);
      console.log(nft);
    });
  }, []);

  return <>
    <Typography component='h1' variant='h1'>NFT:</Typography>
    <Typography component='h2' variant='h2'>{item?.title}</Typography>
    <img src={item?.image} alt={item?.title} width="50%"/>
    <Typography component='p' variant='p'>Description: {item?.description}</Typography>
    <Typography component='p' variant='p'>Price: {ethers.utils.formatEther(item?.price || 0)} NFTToken</Typography>
    <Button variant='contained'>Buy</Button>
  </>
}

export default NFTPage;
