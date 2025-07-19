const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const fs = require("fs");
require('dotenv').config();

const ABI = require("./contractABI.json");

const app = express();
const PORT = process.env.PORT || 3000;

const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// Middleware
app.use(cors());
app.use(express.json());

// === Log Tracker ===
const logUserInteraction = (data) => {
  const logPath = "./user_logs.json";
  const current = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
  current.push({ ...data, timestamp: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(current, null, 2));
};

// === Route: Quote Calculator ===
app.post("/api/quote", async (req, res) => {
  const { fiatAmount, fiatCurrency, cryptoCurrency, walletAddress } = req.body;
  try {
    const chargePercentage = 0.088;
    const rate = 1; // Placeholder — replace with real price feed if needed
    const cryptoAmount = fiatAmount * rate;
    const adjustedAmount = cryptoAmount * (1 - chargePercentage);

    logUserInteraction({
      type: "quote",
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
      walletAddress,
      originalAmount: cryptoAmount,
      adjustedAmount
    });

    res.status(200).json({
      originalAmount: cryptoAmount.toFixed(4),
      adjustedAmount: adjustedAmount.toFixed(4),
      chargePercentage
    });
  } catch (err) {
    console.error("Quote Error:", err);
    res.status(500).json({ error: "Quote failed" });
  }
});

// === Route: Log Banxa Checkout Initiation ===
app.post("/api/initiate", async (req, res) => {
  const { walletAddress, fiatAmount, fiatCurrency, cryptoCurrency } = req.body;
  try {
    logUserInteraction({
      type: "banxa_initiate",
      walletAddress,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency

// === Route: (Optional) Smart Contract Call Example ===
app.post("/api/contract/withdraw", async (req, res) => {
  const { to, amount } = req.body;

  try {
    const tx = await contract.withdrawTo(to, ethers.parseUnits(amount.toString(), 18));
    await tx.wait();

    logUserInteraction({ type: "withdraw", to, amount, txHash: tx.hash });
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error("Withdraw Error:", err);
    res.status(500).json({ error: "Smart contract call failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
