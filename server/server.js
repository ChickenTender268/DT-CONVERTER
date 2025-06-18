// server.js (Backend)
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Step 1: Get pricing and calculate receipt with 10% fee (Mocked for Paybis integration)
app.post("/api/quote", async (req, res) => {
  const { fiatAmount, fiatCurrency, cryptoCurrency } = req.body;

  try {
    // Placeholder logic simulating Paybis price fetch
    const rate = 1; // Example rate: 1 USD = 1 USDT
    const cryptoAmount = fiatAmount * rate;
    const chargePercentage = 0.10; // 10% markup
    const adjustedCryptoAmount = cryptoAmount * (1 - chargePercentage);

    res.status(200).json({
      originalAmount: cryptoAmount.toFixed(2),
      adjustedCryptoAmount: adjustedCryptoAmount.toFixed(2),
      chargePercentage,
      fiatAmount,
      fiatCurrency,
      cryptoCurrency,
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
    // Optional delay for UX
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3s loading

    // Generate Paybis URL with query params
    const paybisUrl = `https://paybis.com/buy-crypto/${fiatCurrency.toLowerCase()}-to-${cryptoCurrency.toLowerCase()}/?wallet=${userAddress}&amount=${fiatAmount}`;

    res.status(200).json({ url: paybisUrl });
  } catch (err) {
    console.error("Initiate API Error:", err);
    res.status(500).json({ error: "Failed to initiate transaction" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

