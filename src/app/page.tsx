"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from '@solana/web3.js';
import Image from "next/image";
import styles from "./Home.module.css"; // Import CSS module
import { SideMenu } from "./SideMenu";
import { useWalletContext } from "./WalletContext";
import { FaQrcode } from 'react-icons/fa';

export default function Home() { 
  const { walletAddress, balance, connectWallet, disconnectWallet, connection } = useWalletContext(); // Access the connection from the context
  const [currencyValues, setCurrencyValues] = useState({
    SOL: "",
    MYR: "0.00",
    CNY: "0.00",
    SGD: "0.00",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solAmount, setSolAmount] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const solToMyrRate = 100; // Example rate (1 SOL = 100 MYR)

  const handleChange = (currency: string, value: string) => {
    if (currency === "SOL") {
      setCurrencyValues({
        ...currencyValues,
        SOL: balance ? `${balance.toFixed(3)} SOL `: 'Loading...'
      });
    } else {
      setCurrencyValues({ ...currencyValues, [currency]: value });
    }
  };

  const handleSend = async () => {
    if (!walletAddress) {
        toast.error("Please provide all required details.");
        return;
    }
    if (!recipientAddress || !solAmount) {
        toast.error("Please provide the recipient's address and the amount.");
        return;
    }

    try {
        const senderPublicKey = new PublicKey(walletAddress);
        const recipientPublicKey = new PublicKey(recipientAddress);
        const { blockhash } = await connection.getLatestBlockhash();
        
        // Create a transaction to send SOL
        const transaction = new Transaction();
        transaction.recentBlockhash = blockhash; // Set the recent blockhash
        transaction.feePayer = senderPublicKey; // Set the fee payer
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: senderPublicKey,
                toPubkey: recipientPublicKey,
                lamports: parseFloat(solAmount) * LAMPORTS_PER_SOL, // Convert SOL to lamports
            })
        );

        // Get the wallet provider (e.g., Phantom) to sign the transaction
        const { solana } = window as any;
        if (solana && solana.isPhantom) {
            const signedTransaction = await solana.signTransaction(transaction);

            // Send the signed transaction using sendRawTransaction
            const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
                skipPreflight: false,
                preflightCommitment: "confirmed",
            });
            console.log("Transaction Signature:", signature);
            toast.success(`Transaction Successful: ${signature}`);
            setIsModalOpen(false);
            } else {
                toast.error("Phantom Wallet not found! Please install it from https://phantom.app");
            }
            } catch (error) {
                console.error("Transaction failed:", error);
                toast.error("Transaction failed. Please try again.");
            }
        };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            <button className={styles.actionButton} onClick={openModal}>Send</button>
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
              value={balance ? `${balance.toFixed(3)} SOL `: 'N/A SOL'}
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
          <h3 className={styles.transactionword} style={{ color: "#ffffff" }}>Transactions</h3>
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

      {/* Modal for Sending SOL */}
      {isModalOpen && (
        <motion.div
          className={styles.modalBackdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className={styles.modalTitle}>Send SOL</h2>
            <input
              type="text"
              placeholder="Recipient's Wallet Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.solAmountContainer}>
              <input
                type="number"
                placeholder="Amount in SOL"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                className={styles.modalInput}
              />
              <FaQrcode size={30} className={styles.qrCodeIcon} />
            </div>

            <p className={styles.myrEquivalent}>
              ≈ {parseFloat(solAmount) * solToMyrRate || 0} MYR
            </p>
            <div className={styles.modalActions}>
              <button onClick={handleSend} className={styles.sendButton}>
                Send
              </button>
              <button onClick={closeModal} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
