import { ethers } from 'ethers';
import contractsData from '../config/contracts.json';
import SenteTokenABI from '../config/SenteTokenABI.json';
import SenteVaultABI from '../config/SenteVaultABI.json';

// Base Sepolia configuration
export const BASE_SEPOLIA_CONFIG = {
  chainId: '0x14a34', // 84532 in hex
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
};

let provider = null;
let signer = null;
let tokenContract = null;
let vaultContract = null;

// Initialize provider
export const initProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
  // Fallback to public RPC
  provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrls[0]);
  return provider;
};

// Get signer
export const getSigner = async () => {
  if (!provider) initProvider();
  signer = await provider.getSigner();
  return signer;
};

// Get token contract instance
export const getTokenContract = async (signerRequired = false) => {
  if (!contractsData?.contracts?.SenteToken) {
    throw new Error('Contract addresses not found. Please deploy contracts first.');
  }

  if (!provider) initProvider();

  const contractSigner = signerRequired ? await getSigner() : provider;
  tokenContract = new ethers.Contract(
    contractsData.contracts.SenteToken,
    SenteTokenABI,
    contractSigner
  );

  return tokenContract;
};

// Get vault contract instance
export const getVaultContract = async (signerRequired = false) => {
  if (!contractsData?.contracts?.SenteVault) {
    throw new Error('Contract addresses not found. Please deploy contracts first.');
  }

  if (!provider) initProvider();

  const contractSigner = signerRequired ? await getSigner() : provider;
  vaultContract = new ethers.Contract(
    contractsData.contracts.SenteVault,
    SenteVaultABI,
    contractSigner
  );

  return vaultContract;
};

// Get user balance from vault
export const getUserBalance = async (address) => {
  try {
    const vault = await getVaultContract();
    const balance = await vault.getBalance(address);
    return ethers.formatUnits(balance, 6); // 6 decimals for USDT
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
};

// Get user savings balance
export const getSavingsBalance = async (address) => {
  try {
    const vault = await getVaultContract();
    const balance = await vault.getSavingsBalance(address);
    return ethers.formatUnits(balance, 6);
  } catch (error) {
    console.error('Error fetching savings balance:', error);
    return '0';
  }
};

// Get unlock time
export const getUnlockTime = async (address) => {
  try {
    const vault = await getVaultContract();
    const unlockTime = await vault.getUnlockTime(address);
    return Number(unlockTime);
  } catch (error) {
    console.error('Error fetching unlock time:', error);
    return 0;
  }
};

// Check if savings are unlocked
export const isSavingsUnlocked = async (address) => {
  try {
    const vault = await getVaultContract();
    return await vault.isSavingsUnlocked(address);
  } catch (error) {
    console.error('Error checking unlock status:', error);
    return false;
  }
};

// Approve tokens
export const approveTokens = async (amount) => {
  try {
    const token = await getTokenContract(true);
    const amountInUnits = ethers.parseUnits(amount.toString(), 6);
    const tx = await token.approve(contractsData.contracts.SenteVault, amountInUnits);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error approving tokens:', error);
    throw error;
  }
};

// Deposit tokens
export const depositTokens = async (amount) => {
  try {
    const vault = await getVaultContract(true);
    const amountInUnits = ethers.parseUnits(amount.toString(), 6);
    const tx = await vault.deposit(amountInUnits);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error depositing tokens:', error);
    throw error;
  }
};

// Withdraw tokens
export const withdrawTokens = async (amount) => {
  try {
    const vault = await getVaultContract(true);
    const amountInUnits = ethers.parseUnits(amount.toString(), 6);
    const tx = await vault.withdraw(amountInUnits);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error withdrawing tokens:', error);
    throw error;
  }
};

// Transfer tokens
export const transferTokens = async (toAddress, amount) => {
  try {
    const vault = await getVaultContract(true);
    const amountInUnits = ethers.parseUnits(amount.toString(), 6);
    const tx = await vault.transfer(toAddress, amountInUnits);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

// Save to vault
export const saveToVault = async (amount, lockDays) => {
  try {
    const vault = await getVaultContract(true);
    const amountInUnits = ethers.parseUnits(amount.toString(), 6);
    const lockDuration = lockDays * 24 * 60 * 60; // Convert days to seconds
    const tx = await vault.saveToVault(amountInUnits, lockDuration);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error saving to vault:', error);
    throw error;
  }
};

// Withdraw from vault
export const withdrawFromVault = async (amount) => {
  try {
    const vault = await getVaultContract(true);
    const amountInUnits = ethers.parseUnits(amount.toString(), 6);
    const tx = await vault.withdrawFromVault(amountInUnits);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error withdrawing from vault:', error);
    throw error;
  }
};

// Claim tokens from faucet (100 sUSDT once per day)
export const claimFaucet = async () => {
  try {
    const token = await getTokenContract(true);
    const tx = await token.claimFaucet();
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Error claiming from faucet:', error);
    throw error;
  }
};

// Check if user can claim from faucet
export const canClaimFaucet = async (address) => {
  try {
    const token = await getTokenContract();
    return await token.canClaimFaucet(address);
  } catch (error) {
    console.error('Error checking faucet eligibility:', error);
    return false;
  }
};

// Format transaction hash for display
export const formatTxHash = (hash) => {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

// Get Base Sepolia explorer link
export const getExplorerLink = (txHash) => {
  return `${BASE_SEPOLIA_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`;
};
