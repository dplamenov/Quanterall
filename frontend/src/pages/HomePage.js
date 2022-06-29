import {Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import contracts from "../contracts/contracts.json";
import marketplaceABI from "../contracts/MarketplaceABI.json";
import NFTABI from "../contracts/NFTABI.json";
import {useState, useEffect} from "react";
import NFT from "../components/NFT";
import NFTTokenABI from "../contracts/NFTTokenABI.json";

function HomePage() {
  const signer = useSelector(state => state.web3.signer);
  const account = useSelector(state => state.web3.account);

  const marketplace = new ethers.Contract(contracts.Marketplace, marketplaceABI, signer);
  const nft = new ethers.Contract(contracts.NFT, NFTABI, signer);
  const nftToken = new ethers.Contract(contracts.NFTToken, NFTTokenABI, signer);

  const [listedItems, setListedItems] = useState([]);
  const [totalSupply, setTotalSupply] = useState(0);
  const [marketLiquidity, setMarketLiquidity] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

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


      if (i.forSale) {
        listedItems.push(item);
      }

      if (listedItems.length === 4) {
        break;
      }
    }

    setListedItems(listedItems);
  }

  useEffect(() => {
    loadListedItems();
    nftToken.totalSupply().then(totalSupply => {
      setTotalSupply(ethers.utils.formatEther(totalSupply));
    })

    nftToken.balanceOf(contracts.TokenMarketplace).then(l => {
      setMarketLiquidity(ethers.utils.formatEther(l));
    });

    nftToken.balanceOf(account).then(balance => {
      setTokenBalance(ethers.utils.formatEther(balance));
    });
  }, []);

  return <>
    <Typography variant='h1' component='h1'>Home page</Typography>
    <Typography variant='h4' component='h2'>Latest NFTs in marketplace</Typography>
    {listedItems.map((item, k) => {
      return <NFT key={k} item={item}/>
    })}
    <Typography variant='h4' component='h2'>NFTToken</Typography>
    <table style={{width: '100%', textAlign: 'center'}}>
      <thead>
      <tr>
        <th>Total supply</th>
        <th>Current market liquidity</th>
        <th>Your balance</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{totalSupply}</td>
        <td>{marketLiquidity}</td>
        <td>{tokenBalance}</td>
      </tr>
      </tbody>
    </table>
  </>
}

export default HomePage;
