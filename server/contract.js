const { ethers } = require("ethers");
require("dotenv").config();
const fs = require("fs");

// Load smart contract ABI
const mainContractABI = JSON.parse(fs.readFileSync("contractABI.json", "utf-8")); // Your smart contract
const tokenABI = JSON.parse(fs.readFileSync("erc20_abi.json", "utf-8")); // The ERC-20 ABI you posted

// Connect to blockchain
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Instantiate contracts
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, mainContractABI, signer);

async function executeConvert(tokenAddress, userAddress, feePercent) {
  try {
    const tx = await contract.convertAndForward(tokenAddress, userAddress, feePercent);
    console.log("convertAndForward TX:", tx.hash);
    return await tx.wait();
  } catch (err) {
    console.error("Smart contract error:", err);
    throw err;
  }
}

// Optional utility: Check token balance
async function getTokenBalance(tokenAddress, address) {
  const token = new ethers.Contract(tokenAddress, tokenABI, provider);
  const balance = await token.balanceOf(address);
  return ethers.formatUnits(balance, 6); // Assuming USDT with 6 decimals
}

module.exports = {
  executeConvert,
  getTokenBalance
};
