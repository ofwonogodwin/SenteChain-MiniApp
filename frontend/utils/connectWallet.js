import { ethers } from 'ethers';
import { BASE_SEPOLIA_CONFIG } from './contract';
import contractsData from '../config/contracts.json';

let provider = null;
let currentAccount = null;

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Hardhat Local Network Configuration
export const HARDHAT_LOCAL_CONFIG = {
  chainId: '0x539', // 1337 in hex
  chainName: 'Hardhat Local',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: [],
};

// Request account access
export const connectWallet = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install it to use this app.');
    }

    // Request account access first
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    currentAccount = accounts[0];
    console.log('Account connected:', currentAccount);

    // Auto-switch to the network where contracts are deployed
    if (contractsData?.network === 'baseSepolia' || contractsData?.chainId === '84532') {
      try {
        await switchToBaseSepolia();
        console.log('Switched to Base Sepolia network');
      } catch (error) {
        console.warn('Could not auto-switch to Base Sepolia:', error.message);
      }
    }

    return currentAccount;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Get current account
export const getCurrentAccount = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    if (accounts && accounts.length > 0) {
      currentAccount = accounts[0];
      return currentAccount;
    }

    return null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Switch to Base Sepolia network
export const switchToBaseSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_SEPOLIA_CONFIG.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BASE_SEPOLIA_CONFIG],
        });
      } catch (addError) {
        // If already pending, ignore and continue
        if (addError.code === -32002) {
          console.log('Network add request already pending, please check MetaMask');
          return;
        }
        console.error('Error adding Base Sepolia network:', addError);
        throw addError;
      }
    } else if (switchError.code === -32002) {
      // Already pending
      console.log('Network switch request already pending, please check MetaMask');
      return;
    } else {
      console.error('Error switching to Base Sepolia:', switchError);
      throw switchError;
    }
  }
};

// Switch to Hardhat Local network
export const switchToHardhatLocal = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_LOCAL_CONFIG.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [HARDHAT_LOCAL_CONFIG],
        });
      } catch (addError) {
        // If already pending, ignore and continue
        if (addError.code === -32002) {
          console.log('Network add request already pending, please check MetaMask');
          return;
        }
        console.error('Error adding Hardhat local network:', addError);
        throw addError;
      }
    } else if (switchError.code === -32002) {
      // Already pending
      console.log('Network switch request already pending, please check MetaMask');
      return;
    } else {
      console.error('Error switching to Hardhat local:', switchError);
      throw switchError;
    }
  }
};

// Get current network
export const getCurrentNetwork = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId;
  } catch (error) {
    console.error('Error getting current network:', error);
    return null;
  }
};

// Listen for account changes
export const onAccountsChanged = (callback) => {
  if (!isMetaMaskInstalled()) {
    return;
  }

  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      currentAccount = null;
      callback(null);
    } else {
      currentAccount = accounts[0];
      callback(currentAccount);
    }
  });
};

// Listen for network changes
export const onChainChanged = (callback) => {
  if (!isMetaMaskInstalled()) {
    return;
  }

  window.ethereum.on('chainChanged', (chainId) => {
    callback(chainId);
  });
};

// Disconnect wallet
export const disconnectWallet = () => {
  currentAccount = null;
  return true;
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get ETH balance
export const getETHBalance = async (address) => {
  try {
    if (!provider) {
      provider = new ethers.BrowserProvider(window.ethereum);
    }
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting ETH balance:', error);
    return '0';
  }
};
