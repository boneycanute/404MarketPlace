// FilePath: src/components/ListedNFTs.js

import React, { useState, useEffect } from 'react';
import { useWeb3 } from './ConnectWallet';
import NFTMintDN404 from '../contracts/NFTMintDN404.json';
import { Container, CardMedia, Grid, Card, CardContent, Link, Typography, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function ListedNFTs() {
    const { web3js, marketplaceContract, connected } = useWeb3();
    const [nftListings, setNftListings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (connected) {
            fetchListings();
        }
    }, [connected]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const allListings = await marketplaceContract.methods.allListings().call();
            console.log("All Listings:", allListings);

            const listingsWithDetails = await Promise.all(
                allListings.map(async (address) => {
                    const URI = await getURI(address);
                    const name = await getName(address);
                    return { nftAddress: address, URI, name };
                })
            );

            console.log(listingsWithDetails);
            setNftListings(listingsWithDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const getURI = async (nftAddress) => {
        try {
            setLoading(true);
            const NFTInstance = new web3js.eth.Contract(NFTMintDN404.abi, nftAddress);
            let baseURI = await NFTInstance.methods.getURI().call();
            const response = await fetch(baseURI);
            const metadata = await response.json();
            console.log("metaData", metadata.image);
            return metadata.image;
        } catch (error) {
            console.error('Error fetching URI:', error);
            return 'default_image_url_or_error_message';
        } finally {
            setLoading(false);
        }
    };

    const getName = async (nftAddress) => {
        setLoading(true);
        const NFTInstance = new web3js.eth.Contract(NFTMintDN404.abi, nftAddress);
        const name = await NFTInstance.methods.name().call();
        setLoading(false);
        return name;
    };

    return (
        <Container maxWidth="md">
            <Typography variant="overline" fontSize={40}>All listed NFTs</Typography>
            {connected ? (
                loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : nftListings.length > 0 ? (
                    <Grid container spacing={2}>
                        {nftListings.map((listing, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Link href={`https://nftmarketplace-a.vercel.app/${listing.nftAddress}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Card sx={{ '&:hover': { boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)', cursor: 'pointer' } }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={listing.URI}
                                            alt={`NFT ${index}`}
                                        />
                                        <CardContent sx={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                                            <Typography variant="h5">{listing.name}</Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography sx={{ marginTop: 3 }}>No NFT minted</Typography>
                )
            ) : (
                <Typography sx={{ marginTop: 3 }}>Connect your wallet to continue</Typography>
            )}
        </Container>
    );
}

export default ListedNFTs;
