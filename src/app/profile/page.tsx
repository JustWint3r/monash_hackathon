"use client";

import React, { useState } from "react";
import { SideMenu } from "../SideMenu";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHashtag, FaTag, FaWallet, FaDollarSign, FaCalendarAlt } from "react-icons/fa";
import styles from "./Profile.module.css"; // Adjust the path if needed

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Owned");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const nfts = [
    {
      title: "Romantic Light",
      imageUrl: "/NFT images/NFT_img2.png",
      roomID: "RID001",
      roomName: "Art Collectors",
      walletAddress: "3uGi...TyXW",
      paymentAmount: "0.05 SOL",
      paymentDate: "2023-08-20",
      deadline: "2023-09-01",
    },
    {
      title: "Ecotherapy",
      imageUrl: "/NFT images/NFT_img3.jpeg",
      roomID: "RID002",
      roomName: "Nature Lovers",
      walletAddress: "6dRi...ZoIP",
      paymentAmount: "0.03 SOL",
      paymentDate: "2023-08-18",
      deadline: "2023-08-28",
    },
    {
      title: "Pippa #001 Cito Midi",
      imageUrl: "/NFT images/NFT_img4.webp",
      roomID: "RID003",
      roomName: "Music Enthusiasts",
      walletAddress: "8dNi...YoIP",
      paymentAmount: "0.07 SOL",
      paymentDate: "2023-08-22",
      deadline: "2023-09-02",
    },
    {
      title: "How Long Does Acid Last?",
      imageUrl: "/NFT images/images.jpeg",
      roomID: "RID004",
      roomName: "Psych Art",
      walletAddress: "4uLi...KaIP",
      paymentAmount: "0.04 SOL",
      paymentDate: "2023-08-25",
      deadline: "2023-09-05",
    },
    {
      title: "Digital Oasis",
      imageUrl: "/NFT images/NFT_img5.jpg",
      roomID: "RID005",
      roomName: "Digital Art",
      walletAddress: "5aXi...LaPR",
      paymentAmount: "0.06 SOL",
      paymentDate: "2023-08-15",
      deadline: "2023-08-30",
    },
    {
      title: "Abstract Thoughts",
      imageUrl: "/NFT images/NFT_img6.jpeg",
      roomID: "RID006",
      roomName: "Abstract Minds",
      walletAddress: "9kRa...SaQR",
      paymentAmount: "0.02 SOL",
      paymentDate: "2023-08-21",
      deadline: "2023-09-01",
    },
    {
      title: "Serene Landscapes",
      imageUrl: "/NFT images/NFT_img7.jpeg",
      roomID: "RID007",
      roomName: "Scenery Collectors",
      walletAddress: "1uLo...FaOR",
      paymentAmount: "0.09 SOL",
      paymentDate: "2023-08-17",
      deadline: "2023-08-27",
    },
    {
      title: "Mystical Vibes",
      imageUrl: "/NFT images/NFT_img8.jpg",
      roomID: "RID008",
      roomName: "Mystic Art",
      walletAddress: "2lBi...HaAR",
      paymentAmount: "0.08 SOL",
      paymentDate: "2023-08-23",
      deadline: "2023-09-03",
    },
  ];

  const showNFTDetails = (nft: {
    title?: string;
    imageUrl?: string;
    roomID: string;
    roomName: string;
    walletAddress: string;
    paymentAmount: string;
    paymentDate: string;
    deadline: string;
  }) => {
    toast.info(
      <div style={{ textAlign: "left", fontSize: "16px", lineHeight: "1.8" }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <img src={nft.imageUrl} alt={nft.title} style={{ width: "100%", borderRadius: "8px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <FaHashtag style={{ marginRight: "8px", color: "#00aced" }} />
          <strong>Room ID : </strong> {nft.roomID}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <FaWallet style={{ marginRight: "8px", color: "#00aced" }} />
          <strong>Receiver Address : </strong> {nft.walletAddress}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <FaDollarSign style={{ marginRight: "8px", color: "#00aced" }} />
          <strong>Payment Amount : </strong> {nft.paymentAmount}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <FaCalendarAlt style={{ marginRight: "8px", color: "#00aced" }} />
          <strong>Payment Date : </strong> {nft.paymentDate}
        </div>
        <button
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: "#00aced",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            textAlign: "center",
          }}
          onClick={() => window.alert(`Visiting room: ${nft.roomName}`)} // Adjust this action as needed
        >
          Visit Room
        </button>
        <button
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: "#00aced",
            border: "none",
            borderRadius: "4px",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            textAlign: "center",
          }}
          onClick={() => window.alert(`Viewing transaction: ${nft.roomName}`)} // Adjust this action as needed
        >
          View Transaction
        </button>
      </div>,
      {
        autoClose: 5000, // Close after 5 seconds
        hideProgressBar: false, // Show the progress bar
        closeOnClick: true,
        pauseOnHover: true, // Keep the toast open while hovering
        draggable: true,
        className: styles.centeredToast, // Use a custom class for more control
      }
    );
  };

  return (
    <>
      {/* Include the sidebar */}
      <SideMenu />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={styles.profileContainer}
      >
        <ToastContainer />
        {/* Profile Header */}
        <div className={styles.header}>
          <div className={styles.profileImage}>
            {/* Replace with actual profile image */}
            <img src="https://img.icons8.com/fluency/48/test-account--v1.png" alt="Profile" />
          </div>
          <div className={styles.userInfo}>
            <h2>John Doe</h2>
            <p style={{ color: "#D3D3D3" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://www.example.com" target="_blank" rel="noreferrer"></a>
              <a href="https://twitter.com/username" target="_blank" rel="noreferrer"></a>
            </div>
          </div>
          <div className={styles.stats}>
            <div>
              <span>8</span>
              <p>Achievements</p>
            </div>
            <div>
              <span>"Trustable"</span>
            </div>
          </div>
          <button className={styles.followButton}>More</button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={activeTab === "Owned" ? styles.activeTab : ""}
            onClick={() => handleTabChange("Owned")}
          >
            Achievements
          </button>
          <button
            className={activeTab === "Created" ? styles.activeTab : ""}
            onClick={() => handleTabChange("Created")}
          >
            Analysis
          </button>
        </div>

        {/* Conditional Rendering */}
        {activeTab === "Owned" ? (
          <div className={styles.nftGrid}>
            {nfts.map((nft, index) => (
              <div
                key={index}
                className={styles.nftCard}
                onClick={() => showNFTDetails(nft)}
              >
                <Image src={nft.imageUrl} alt={nft.title} width={200} height={200} />
                <p>{nft.title}</p>
              </div>
            ))}
          </div>
        ) : (
            <div className={styles.analysisContainer}>
            <Image 
              src="/NFT images/Analysis Dashboard.png" 
              alt="Analysis Dashboard" 
              width={1400} 
              height={800} 
              style={{ borderRadius: "8px" }} 
            />
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Profile;
