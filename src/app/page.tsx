"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaQrcode } from 'react-icons/fa';
import Image from "next/image";
import styles from "./Home.module.css"; // Import CSS module
import { SideMenu } from "./SideMenu";
import { useWalletContext } from "./WalletContext";

export default function Home() {
  const { walletAddress, balance, connectWallet, disconnectWallet } = useWalletContext();
  const [currencyValues, setCurrencyValues] = useState({
    SOL: "",
    MYR: "0.00",
    CNY: "0.00",
    SGD: "0.00",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solAmount, setSolAmount] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [conversionRate, setConversionRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const { data } = await axios.get(
          "https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000"
        );
        const usdRate = data.Price;
        const myrRate = usdRate * 4.5; // Adjust as needed for USD to MYR conversion
        setConversionRate(myrRate);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    fetchConversionRate();
  }, []);

  const handleChange = (currency: string, value: string) => {
    if (currency === "SOL") {
      setCurrencyValues({
        ...currencyValues,
        SOL: balance ? `${balance.toFixed(3)} SOL ` : 'Loading...'
      });
    } else {
      setCurrencyValues({ ...currencyValues, [currency]: value });
    }
  };

  const handleSend = () => {
    // Implement the logic for sending SOL here
    console.log("Sending", solAmount, "SOL to", recipientAddress);
    setIsModalOpen(false);
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
                {balance ? `${balance.toFixed(3)} SOL ` : 'Loading...'}
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
              value={balance ? `${balance.toFixed(3)} SOL ` : 'N/A SOL'}
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
            <Image src="/flags/china-flag.jpg" alt="CNY" width={30} height={20} />
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
            <div className={styles.walletAddressContainer}>
              <input
                type="text"
                placeholder="Recipient's Wallet Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className={styles.modalInput}
              />
              <FaQrcode size={30} className={styles.qrCodeIcon} />
            </div>
            <div className={styles.solAmountContainer}>
              <input
                type="number"
                placeholder="Amount in SOL"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                className={styles.modalInput}
              />
            </div>

            <p className={styles.myrEquivalent}>
              ≈ {conversionRate ? ((parseFloat(solAmount) || 0) * conversionRate).toFixed(2) : "0.00"} MYR
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
