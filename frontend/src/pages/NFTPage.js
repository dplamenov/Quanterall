import {Typography, Button, TextField, Container} from '@mui/material';
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import marketplaceABI from "../contracts/MarketplaceABI.json";
import {useEffect, useState} from "react";
import NFTABI from "../contracts/NFTABI.json";
import {useParams} from "react-router";
import * as React from "react";
import NFTTokenABI from "../contracts/NFTTokenABI.json";

function NFTPage() {
  const signer = useSelector(state => state.web3.signer);
  const account = useSelector(state => state.web3.account);
  const data = useSelector(state => state.web3.account);

  const marketplace = new ethers.Contract(contracts.Marketplace, marketplaceABI, signer);
  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);

  const nft = new ethers.Contract(contracts.NFT, NFTABI, signer);
  const [item, setItem] = useState();
  const [price, setPrice] = useState('1');

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
      image: metadata.image,
      owner: i.owner.toLowerCase(),
      i
    }
  };

  const buyHandler = async () => {
    await nftToken.increaseAllowance(marketplace.address, ethers.utils.parseEther(item.price.toString()));
    await marketplace.purchaseItem(item.itemId)
  };

  const saleHandler = async () => {
    await marketplace.forSale(item.i.nft, price, 1);
  }

  useEffect(() => {
    load(+params.id).then(nft => {
      setItem(nft);
    });
  }, []);

  return <>
    <Typography component='h1' variant='h1'>NFT:</Typography>
    <Typography component='h2' variant='h2'>{item?.title}</Typography>
    <img src={item?.image} alt={item?.title} width="20%"/>
    <Typography component='p' variant='p'>Description: {item?.description}</Typography>
    {item?.forSale &&
    <Typography component='p' variant='p'>Price: {ethers.utils.formatEther(item?.price || 0)} NFTToken</Typography>}
    {item?.forSale && <Button variant='contained' onClick={buyHandler}>Buy</Button>}
    {(!item?.forSale && account === item?.owner) &&
    <>
      <Typography variant='h3' component='h3'>Put on marketplace</Typography>
      <Container maxWidth={false} disableGutters sx={{marginTop: '20px', display: 'flex', gap: '10px'}}>
        <TextField id="price-input" label="Price" variant="outlined" onChange={e => setPrice(e.target.value)}
                   value={price}/>
        <Button variant='contained' onClick={saleHandler}>Sale on marketplace</Button>
      </Container>
    </>
    }
  </>
}

export default NFTPage;
