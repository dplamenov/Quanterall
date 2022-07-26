import {useState, useEffect} from "react";
import {Container, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {ethers} from "ethers";
import NFT from "../components/NFT";
import contracts from "../contracts/contracts.json";
import marketplaceABI from "../contracts/MarketplaceABI.json";
import NFTABI from "../contracts/NFTABI.json";
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

    for (let index = 1; index <= Math.min(itemCount, 4); index++) {
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
    }

    setListedItems(listedItems);
  }

  useEffect(() => {
    loadListedItems();
    nftToken.totalSupply().then(totalSupply => {
      setTotalSupply(+ethers.utils.formatEther(totalSupply));
    })

    nftToken.balanceOf(contracts.TokenMarketplace).then(l => {
      setMarketLiquidity(+ethers.utils.formatEther(l));
    });

    nftToken.balanceOf(account).then(balance => {
      setTokenBalance(+ethers.utils.formatEther(balance));
    });
  }, []);

  return <>
    <Typography variant='h1' component='h1'>Home page</Typography>
    <Typography component='p' variant='p' sx={{textAlign: 'justify'}}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet cupiditate
      eos fugit ipsam nemo neque voluptate! Ad, alias aspernatur aut deserunt dolore eius eveniet excepturi expedita
      fuga harum laudantium officia pariatur perspiciatis quam rem repudiandae similique voluptates. Consequatur culpa
      expedita mollitia nulla officiis omnis sed vero? Accusamus alias aliquam asperiores corporis cumque deleniti
      dignissimos dolore dolorem doloremque hic illo incidunt inventore itaque laboriosam laborum minima mollitia nemo
      nisi nulla quae quia, quidem quod quos soluta ut voluptas voluptatibus? Aliquam aliquid asperiores cupiditate
      dolores ducimus eaque, esse, eveniet facere illo labore modi nihil obcaecati quisquam repellendus unde veniam
      voluptatem voluptatum.
    </Typography>
    <Typography variant='h4' component='h2'>Latest NFTs in marketplace</Typography>
    {listedItems.length === 0 && <Typography component='p' variant='p'>No NFTs in marketplace</Typography>}
    <Container disableGutters maxWidth={false} sx={{display: 'flex', flexDirection: 'row'}}>
      {listedItems.map((item, k) => {
        return <NFT key={k} item={item}/>
      })}
    </Container>
    <Typography variant='h4' component='h2'>NFTToken stats</Typography>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Total supply</TableCell>
          <TableCell>Current market liquidity</TableCell>
          <TableCell>Your balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          <TableRow>
            <TableCell component="th">
              {totalSupply.toFixed(2)}
            </TableCell>
            <TableCell component="th">
              {marketLiquidity.toFixed(2)}
            </TableCell>
            <TableCell component="th">
              {tokenBalance.toFixed(2)}
            </TableCell>
          </TableRow>
      </TableBody>
    </Table>
  </>
}

export default HomePage;
