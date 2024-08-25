  import {
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    Keypair,
    PublicKey,
  } from "@solana/web3.js";
  
  import bs58 from "bs58";
  import { useWalletContext } from "@/app/WalletContext";
  
  function base58ToKeypair(base58PrivateKey: string): Keypair {
    try {
      const privateKeyBuffer = bs58.decode(base58PrivateKey);
      return Keypair.fromSecretKey(privateKeyBuffer);
    } catch (error) {
      throw new Error("Invalid base58 private key.");
    }
  }
  
  export const sendTransaction = async (
    senderPrivateKey: string, // Sender's private key in base58 format
    receiverAddress: string, // Receiver's public key
    amountInSol: number // Amount to send in SOL
  ) => {
    try {
      // Access the connection from the context
      const { connection } = useWalletContext();
  
      // Convert the sender's private key to a Keypair
      const sender = base58ToKeypair(senderPrivateKey);
  
      // Create the receiver's public key
      const receiver = new PublicKey(receiverAddress);
  
      // Create the transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: receiver,
        lamports: amountInSol * LAMPORTS_PER_SOL, // Convert SOL to lamports
      });

      // Create the transaction
      const transaction = new Transaction().add(transferInstruction);
  
      // Send and confirm the transaction
      const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
      );
  
      console.log(
        "Transaction Signature:",
        `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
      );
  
      return transactionSignature;
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };
  