"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { toast } from 'react-toastify';

interface WalletContextType {
  walletAddress: string | null;
  balance: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  const connectWallet = async () => {
    try {
      const { solana } = window as any;

      if (solana && solana.isPhantom) {
        const response = await solana.connect();
        const account = response.publicKey.toString();
        setWalletAddress(account);

        // Fetch and set balance after connection
        fetchWalletBalance(account);

        toast.success(`Connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
      } else {
        toast.error('Phantom Wallet not found! Please install it from https://phantom.app');
      }
    } catch (error) {
      toast.error('Failed to connect wallet.');
      console.error('Error connecting to Phantom Wallet:', error);
    }
  };

  const fetchWalletBalance = async (account: string) => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const publicKey = new PublicKey(account);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    } catch (error) {
      toast.error('Failed to fetch balance.');
      console.error('Error fetching balance:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    toast.info('Wallet disconnected.');
  };

  return (
    <WalletContext.Provider value={{ walletAddress, balance, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
