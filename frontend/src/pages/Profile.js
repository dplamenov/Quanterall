import {useEffect, useState} from "react";
import {Container, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {ethers} from 'ethers';
import contracts from "../contracts/contracts.json";
import NFTTokenABI from '../contracts/NFTABI.json';
import marketplaceABI from "../contracts/MarketplaceABI.json";
import NFTABI from "../contracts/NFTABI.json";
import NFT from "../components/NFT";

function Profile() {
  const data = useSelector(state => state.web3);
  const signer = useSelector(state => state.web3.signer);

  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);
  const marketplace = new ethers.Contract(contracts.Marketplace, marketplaceABI, signer);
  const nft = new ethers.Contract(contracts.NFT, NFTABI, signer);

  const [balance, setBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [myNfts, setMyNfts] = useState({
    forSale: [],
    notForSale: []
  });

  const load = async () => {
    const itemCount = await marketplace.itemCount();

    for (let index = 1; index <= itemCount; index++) {
      const i = await marketplace.items(index)
      if (i.owner.toLowerCase() !== data.account.toLowerCase()) {
        continue;
      }

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
        image: metadata.image,
        owner: i.owner
      }

      if (i.forSale) {
        setMyNfts(nfts => ({...nfts, forSale: [...nfts.forSale, item]}))
      } else {
        setMyNfts(nfts => ({...nfts, notForSale: [...nfts.notForSale, item]}))
      }
    }
  }

  useEffect(() => {
    data.provider.getBalance(data.account).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      setBalance(balanceInEth);
    });

    nftToken.balanceOf(data.account).then((balance) => {
      const parsedBalance = ethers.utils.formatEther(balance)
      setTokenBalance(parsedBalance);
    });

    load();
  }, []);

  return <>
    <Typography variant='h1' component='h1'>Profile</Typography>

    <Typography component='h3' variant='h3'>Info</Typography>
    <table style={{width: '100%', textAlign: 'center'}}>
      <thead>
      <tr>
        <th>Address</th>
        <th>Ether balance</th>
        <th>NFTToken balance</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{data.account}</td>
        <td>{Number(balance).toFixed(2)} ETH</td>
        <td>{Number(tokenBalance).toFixed(2)}</td>
      </tr>
      </tbody>
    </table>

    <Typography component='h3' variant='h3'>My NFTs</Typography>
    <Container disableGutters maxWidth={false} sx={{display: 'flex'}}>
      <Container disableGutters maxWidth={false}>
        <Typography component='h4' variant='h4'>Not for sale</Typography>
        <Container sx={{display: 'flex', gap: '20px', flexWrap: 'wrap'}} maxWidth={false} disableGutters>
          {myNfts.notForSale.map(nft => {
            return <NFT item={nft} key={nft.itemId}/>
          })}
        </Container>
      </Container>

      <Container disableGutters maxWidth={false}>
        <Typography component='h5' variant='h4'>For sale</Typography>
        <Container sx={{display: 'flex', gap: '20px', flexWrap: 'wrap'}} maxWidth={false} disableGutters>
          {myNfts.forSale.map(nft => {
            return <NFT item={nft} key={nft.itemId}/>
          })}
        </Container>
      </Container>
    </Container>
  </>
}


export default Profile;
