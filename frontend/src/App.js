import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListNFTWithPermit from './components/ListNFTWithPermit';
import CreateNFT from './components/CreateNFT';
import NFTPage from './components/NFTPage';
import Navigation from './components/Navigation';
import Home from './components/Home';
import './App.css'
import ListedNFTs from './components/ListedNFTs';

function App() {

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-nft" element={<ListNFTWithPermit />} />
        <Route path="/create-nft" element={<CreateNFT />} />
        <Route path="/:contractAddress" element={<NFTPage />} />
        <Route path="/listed-nfts" element={<ListedNFTs />} />
      </Routes>
    </Router>
  );
};

export default App;
