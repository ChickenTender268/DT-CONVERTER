// server.js (Backend)
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load environment variables
const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Smart Contract ABI
const ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "transferFrom",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// Step 1: Get pricing and calculate receipt with 10% fee (Mocked for Paybis integration)
app.post("/api/quote", async (req, res) => {
  const { fiatAmount, fiatCurrency, cryptoCurrency } = req.body;

  try {
    const rate = 1; // Example: 1 USD = 1 USDT
    const cryptoAmount = fiatAmount * rate;
    const chargePercentage = 0.10;
    const adjustedCryptoAmount = cryptoAmount * (1 - chargePercentage);

    res.status(200).json({
      originalAmount: cryptoAmount.toFixed(2),
      adjustedCryptoAmount: adjustedCryptoAmount.toFixed(2),
      chargePercentage,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency
    });
  } catch (err) {
    console.error("Quote API Error:", err);
    res.status(500).json({ error: "Failed to get quote" });
  }
});

// Step 2: Redirect to Paybis Widget after simulated delay
app.post("/api/initiate", async (req, res) => {
  const { userAddress, fiatAmount, fiatCurrency, cryptoCurrency } = req.body;

  try {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3s loading
    const paybisUrl = `https://paybis.com/buy-crypto/${fiatCurrency.toLowerCase()}-to-${cryptoCurrency.toLowerCase()}/?wallet=${userAddress}&amount=${fiatAmount}`;
    res.status(200).json({ url: paybisUrl });
  } catch (err) {
    console.error("Initiate API Error:", err);
    res.status(500).json({ error: "Failed to initiate transaction" });
  }
});

// Step 3: Trigger smart contract payment split
app.post("/api/send", async (req, res) => {
  const { recipient, amount } = req.body;

  try {
    const tx = await contract.transfer(recipient, ethers.parseUnits(amount.toString(), 18));
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error("Smart contract transfer error:", error);
    res.status(500).json({ error: "Contract interaction failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

