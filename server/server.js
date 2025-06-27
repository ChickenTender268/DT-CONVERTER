const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const INFURA_URL = process.env.INFURA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);


app.use(cors()); {
origin: 'https://baibaic.xyz'
app.use(express.json())};


app.post("/api/quote", async (req, res) => {
  const { fiatAmount, fiatCurrency, cryptoCurrency } = req.body;

  try {
    const rate = 1; 
    const cryptoAmount = fiatAmount * rate;
    const chargePercentage = 0.10;
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

app.post("/api/initiate", async (req, res) => {
  const { userAddress, fiatAmount, fiatCurrency, cryptoCurrency } = req.body;

  try {
    await new Promise(resolve => setTimeout(resolve, 3000));

  
    const paybisUrl = `https://paybis.com/?refId=42748`;

    res.status(200).json({ url: paybisUrl });
  } catch (err) {
    console.error("Initiate API Error:", err);
    res.status(500).json({ error: "Failed to initiate transaction" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
