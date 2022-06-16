import {Container, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import contracts from "../contracts/contracts.json";
import marketplaceABI from "../contracts/MarketplaceABI.json";
import NFTABI from "../contracts/NFTABI.json";
import {ethers} from 'ethers';
import NFT from "../components/NFT";

function Marketplace() {
  const signer = useSelector(state => state.web3.signer);
  const marketplace = new ethers.Contract(contracts.Marketplace, marketplaceABI, signer);
  const nft = new ethers.Contract(contracts.NFT, NFTABI, signer);

  const [listedItems, setListedItems] = useState([])

  const loadListedItems = async () => {
    const itemCount = await marketplace.itemCount();
    const listedItems = []

    for (let index = 1; index <= itemCount; index++) {
      const i = await marketplace.items(index)
      const uri = await nft.tokenURI(i.tokenId)
      const response = await fetch(uri)
      const metadata = await response.json()
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      const item = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        title: metadata.title,
        description: metadata.description,
        image: metadata.image
      }
      listedItems.push(item);
    }

    setListedItems(listedItems);
  }

  useEffect(() => {
    loadListedItems()
  }, [])

  return <>
    <Typography variant='h1' component='h1'>Marketplace</Typography>
    <Container sx={{display: 'flex', gap: '20px', flexWrap: 'wrap'}} maxWidth={false} disableGutters>
      {listedItems.map((item, k) => {
        return <NFT key={k} item={item}/>
      })}
    </Container>
  </>
}

export default Marketplace;
