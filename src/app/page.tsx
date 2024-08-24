"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import StartLoader from "./startLoader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import Sidebar from './Sidebar';
import Image from "next/image";
import styles from "./Home.module.css"; // Import CSS module
import { SideMenu } from "./SideMenu";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [currencyValues, setCurrencyValues] = useState({
    SOL: "",
    MYR: "0.00",
    CNY: "0.00",
    SGD: "0.00",
  });
  const publicKey = walletAddress ? new PublicKey(walletAddress) : null;

  useEffect(() => {
    // Update the SOL value whenever balance or wallet changes
    setCurrencyValues((prevValues) => ({
      ...prevValues,
      SOL: publicKey
        ? balance !== null
          ? `${balance.toFixed(3)} SOL`
          : "Loading..."
        : "N/A SOL",
    }));
  }, [publicKey, balance]);

  const handleChange = (currency: string, value: string) => {
    if (currency !== "SOL") {
        // Update the other currency values as needed
        setCurrencyValues({ ...currencyValues, [currency]: value });
      }
  };

  const handleGetStarted = () => {
    setIsLoading(true);
    // Add logic here to fetch wallet balance if needed
  };

  // Function to connect to Phantom Wallet
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

  // Function to fetch the balance from the Solana network
  const fetchWalletBalance = async (account: string) => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // Change 'devnet' to 'mainnet-beta' for mainnet
      const publicKey = new PublicKey(account);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL (1 SOL = 1e9 lamports)
    } catch (error) {
      toast.error('Failed to fetch balance.');
      console.error('Error fetching balance:', error);
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
    toast.info('Wallet disconnected.');
  };

  // Auto-connect to Phantom if the user is already connected
  useEffect(() => {
    const { solana } = window as any;
    if (solana && solana.isPhantom) {
      solana.connect({ onlyIfTrusted: true }).then((response: any) => {
        const account = response.publicKey.toString();
        setWalletAddress(account);
        fetchWalletBalance(account);
      });
    }
  }, []);

  if (isLoading) {
    return <StartLoader />;
  }

  return (
    <>
      <SideMenu />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={styles.walletContainer}
      >
        <div className={styles.balanceSection}>
          <h2 className={styles.totalBalance}>Total balance: </h2>
          <h1 className={styles.balanceAmount}>
            {walletAddress ? (
                <div>
                    {balance ? `${balance.toFixed(3)} SOL `: 'Loading...'}
                </div>
                ) : (
                <p>N/A SOL</p>
            )}
          </h1>
          <div className={styles.balanceActions}>
            <button className={styles.actionButton}>Send</button>
            <button className={styles.actionButton}>Reload</button>
            <button className={styles.actionButton}>Request</button>
            {walletAddress ? (
                <button className={styles.actionButton} onClick={disconnectWallet}>
                    Disconnect Wallet
                </button>
                ) : (
                <button className={styles.actionButton} onClick={connectWallet}>
                    Connect Wallet
                </button>
            )}
          </div>
        </div>
        <div className={styles.currencyGrid}>
          <div className={styles.currencyCard}>
            <Image
              src="/flags/solana-logo.avif"
              alt="SOL"
              width={30}
              height={20}
            />
            <span>SOL</span>
            <input
              type="text"
              value={currencyValues.SOL}
              onChange={(e) => handleChange("SOL", e.target.value)}
              className={styles.currencyInput}
            />
          </div>
          <div className={styles.currencyCard}>
            <Image
              src="/flags/malaysia-flag.jpg"
              alt="MYR"
              width={30}
              height={20}
            />
            <span>MYR</span>
            <input
              type="text"
              value={currencyValues.MYR}
              onChange={(e) => handleChange("MYR", e.target.value)}
              className={styles.currencyInput}
            />
          </div>
          <div className={styles.currencyCard}>
            <Image src="/flags/china-flag.jpg" alt="JPY" width={30} height={20} />
            <span>CNY</span>
            <input
              type="text"
              value={currencyValues.CNY}
              onChange={(e) => handleChange("CNY", e.target.value)}
              className={styles.currencyInput}
            />
          </div>
          <div className={styles.currencyCard}>
            <Image
              src="/flags/singapore-flag.avif"
              alt="SGD"
              width={30}
              height={20}
            />
            <span>SGD</span>
            <input
              type="text"
              value={currencyValues.SGD}
              onChange={(e) => handleChange("SGD", e.target.value)}
              className={styles.currencyInput}
            />
          </div>
        </div>
        <div className={styles.transactionsSection}>
          <h3 className = {styles.transactionword} style={{ color: "#ffffff" }}>Transactions</h3>
          <ul className={styles.transactionsList}>
            <li className={styles.transactionItem}>
              <span>Youtube Premium</span>
              <span>RID001</span>
              <span>0.0118 SOL</span>
            </li>
            <li className={styles.transactionItem}>
              <span>Spotify Premium</span>
              <span>RID002</span>
              <span>0.0115 SOL</span>
            </li>
            <li className={styles.transactionItem}>
              <span>Spotify Premium</span>
              <span>RID003</span>
              <span>0.0115 SOL</span>
            </li>
            <li className={styles.transactionItem}>
              <span>Spotify Premium</span>
              <span>RID004</span>
              <span>0.0115 SOL</span>
            </li>
            <li className={styles.transactionItem}>
              <span>Spotify Premium</span>
              <span>RID005</span>
              <span>0.0115 SOL</span>
            </li>
            <li className={styles.transactionItem}>
              <span>Spotify Premium</span>
              <span>0.0115 SOL</span>
            </li>
          </ul>
        </div>
      

      {/* Toast Notifications */}
      <ToastContainer />
    </motion.div>
    </>
  );
}