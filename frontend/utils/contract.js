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

// Check if Hardhat node is running
export const checkHardhatNode = async () => {
  try {
    const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const network = await localProvider.getNetwork();
    return network.chainId === 1337n; // Hardhat local network
  } catch (error) {
    console.warn('Hardhat local node not detected:', error.message);
    return false;
  }
};

// Initialize provider
export const initProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }

  // Fallback: Try local Hardhat first, then public RPC
  try {
    // Check if contracts are deployed locally
    if (contractsData?.network === 'localhost' || contractsData?.chainId === '1337') {
      provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      console.log('Using Hardhat local provider');
    } else {
      provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrls[0]);
      console.log('Using Base Sepolia provider');
    }
  } catch (error) {
    console.error('Error initializing provider:', error);
    provider = new ethers.JsonRpcProvider(BASE_SEPOLIA_CONFIG.rpcUrls[0]);
  }

  return provider;
};

// Request wallet connection
export const connectWallet = async () => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask extension.');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the connected accounts
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    console.log('Wallet connected:', address);
    return address;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Get signer
export const getSigner = async () => {
  try {
    // Always use window.ethereum for signing transactions
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask extension.');
    }

    // Request account access if not already connected
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create a fresh browser provider from MetaMask
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    signer = await browserProvider.getSigner();

    console.log('Signer obtained:', await signer.getAddress());
    return signer;
  } catch (error) {
    console.error('Error getting signer:', error);

    // Provide more specific error message
    if (error.code === 4001) {
      throw new Error('Please connect your MetaMask wallet to continue.');
    }
    throw new Error('Failed to get signer. Please ensure MetaMask is unlocked and try again.');
  }
};

// Get token contract instance
export const getTokenContract = async (signerRequired = false) => {
  try {
    if (!contractsData?.contracts?.SenteToken) {
      throw new Error('Contract addresses not found. Please deploy contracts first.');
    }

    // If signer is required, get it from MetaMask
    if (signerRequired) {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask extension to send transactions.');
      }

      // Request account access if not already connected
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Always create a fresh signer for transactions
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const contractSigner = await browserProvider.getSigner();

      console.log('Creating token contract with signer:', await contractSigner.getAddress());

      tokenContract = new ethers.Contract(
        contractsData.contracts.SenteToken,
        SenteTokenABI,
        contractSigner
      );
    } else {
      // Use provider for read-only operations
      if (!provider) {
        initProvider();
      }

      tokenContract = new ethers.Contract(
        contractsData.contracts.SenteToken,
        SenteTokenABI,
        provider
      );
    }

    return tokenContract;
  } catch (error) {
    console.error('Error getting token contract:', error);

    // Provide more specific error message
    if (error.code === 4001) {
      throw new Error('Please connect your MetaMask wallet to continue.');
    }
    throw error;
  }
};// Get vault contract instance
export const getVaultContract = async (signerRequired = false) => {
  try {
    if (!contractsData?.contracts?.SenteVault) {
      console.warn('Contract addresses not found in contracts.json');
      throw new Error('Contract addresses not found. Please deploy contracts first.');
    }

    // If signer is required, get it from MetaMask
    if (signerRequired) {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask extension to send transactions.');
      }

      // Request account access if not already connected
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Always create a fresh signer for transactions
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const contractSigner = await browserProvider.getSigner();

      console.log('Creating vault contract with signer:', await contractSigner.getAddress());

      vaultContract = new ethers.Contract(
        contractsData.contracts.SenteVault,
        SenteVaultABI,
        contractSigner
      );
    } else {
      // Use provider for read-only operations
      if (!provider) {
        initProvider();
      }

      vaultContract = new ethers.Contract(
        contractsData.contracts.SenteVault,
        SenteVaultABI,
        provider
      );
    }

    return vaultContract;
  } catch (error) {
    console.error('Error getting vault contract:', error);

    // Provide more specific error message
    if (error.code === 4001) {
      throw new Error('Please connect your MetaMask wallet to continue.');
    }
    throw error;
  }
};

// Get user balance from vault
export const getUserBalance = async (address) => {
  try {
    // Validate address
    if (!address || !ethers.isAddress(address)) {
      console.warn('Invalid address provided:', address);
      return '0';
    }

    // Force fresh provider to avoid caching issues
    provider = null;
    const vault = await getVaultContract();

    // Check if contract is deployed by calling a view function
    try {
      const balance = await vault.getBalance(address);
      const formattedBalance = ethers.formatUnits(balance, 6); // 6 decimals for USDT
      console.log(`Balance for ${address}: ${formattedBalance} sUSDT`);
      return formattedBalance;
    } catch (contractError) {
      console.error('Contract call failed - is Hardhat node running?', contractError);
      // Return 0 if contract isn't available instead of crashing
      return '0';
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
};

// Get user savings balance
export const getSavingsBalance = async (address) => {
  try {
    // Validate address
    if (!address || !ethers.isAddress(address)) {
      console.warn('Invalid address provided:', address);
      return '0';
    }

    // Force fresh provider to avoid caching issues
    provider = null;
    const vault = await getVaultContract();

    try {
      const balance = await vault.getSavingsBalance(address);
      const formattedBalance = ethers.formatUnits(balance, 6);
      console.log(`Savings balance for ${address}: ${formattedBalance} sUSDT`);
      return formattedBalance;
    } catch (contractError) {
      console.error('Contract call failed - is Hardhat node running?', contractError);
      return '0';
    }
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
