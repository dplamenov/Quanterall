import { useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers';
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import contracts from "../contracts/contracts.json";
import marketplaceABI from "../contracts/MarketplaceABI.json";
import NFTABI from "../contracts/NFTABI.json";
import {Container, Typography, Input, TextField, Button} from "@mui/material";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function Create() {
  const signer = useSelector(state => state.web3.signer);

  const marketplace = new ethers.Contract(contracts.Marketplace, marketplaceABI, signer);
  const nft = new ethers.Contract(contracts.NFT, NFTABI, signer);

  const [image, setImage] = useState();
  const [price, setPrice] = useState('1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const uploadFileHandler = async (e) => {
    const file = await client.add(e.target.files[0]);
    setImage(`https://ipfs.infura.io/ipfs/${file.path}`);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await client.add(JSON.stringify({ image, price, title, description }));
    const uri = `https://ipfs.infura.io/ipfs/${result.path}`;

    await (await nft.mint(uri)).wait()
    const id = await nft.tokenCount()
    await (await nft.setApprovalForAll(marketplace.address, true)).wait()
    await (await marketplace.mint(nft.address, id)).wait();
    navigate('/marketplace');
  };

  return (
    <>
      <Typography component='h1' variant='h1'>Create</Typography>
      <Container maxWidth={false} disableGutters sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <Typography component='h5' variant='h5'>Upload file for NFT</Typography>

        <Input type="file" onChange={uploadFileHandler}/>
        <TextField id="title-input" label="Title" variant="outlined" onChange={e => setTitle(e.target.value)} value={title}/>
        <TextField id="description-input" label="Description" variant="outlined" onChange={e => setDescription(e.target.value)} value={description}/>
        <Button onClick={handleCreate}>Create</Button>
      </Container>
    </>
  )
}

export default Create;