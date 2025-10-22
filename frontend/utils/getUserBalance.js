/**
 * @file getUserBalance.js
 * @description Production-grade function to fetch user balance from SenteVault contract
 * @author Senior Blockchain Developer
 * @version 1.0.0
 */

import { ethers } from 'ethers';
import contractsData from '../config/contracts.json';
import SenteVaultABI from '../config/SenteVaultABI.json';

/**
 * Network configurations
 */
const NETWORKS = {
  HARDHAT_LOCAL: {
    chainId: 1337,
    chainIdHex: '0x539',
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
  },
  BASE_SEPOLIA: {
    chainId: 84532,
    chainIdHex: '0x14a34',
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
  },
};

/**
 * Get the expected network configuration based on contracts.json
 */
function getExpectedNetwork() {
  const chainId = parseInt(contractsData.chainId);

  if (chainId === 1337) {
    return NETWORKS.HARDHAT_LOCAL;
  } else if (chainId === 84532) {
    return NETWORKS.BASE_SEPOLIA;
  }

  throw new Error(`Unsupported chain ID: ${chainId}`);
}

/**
 * Verify that MetaMask is connected to the correct network
 */
async function verifyNetwork(provider) {
  const expectedNetwork = getExpectedNetwork();
  const network = await provider.getNetwork();
  const currentChainId = Number(network.chainId);

  if (currentChainId !== expectedNetwork.chainId) {
    throw new Error(
      `Network mismatch: Contract deployed on ${expectedNetwork.name} (${expectedNetwork.chainId}), ` +
      `but MetaMask is on chain ${currentChainId}. Please switch networks.`
    );
  }

  return expectedNetwork;
}

/**
 * Check if the contract exists at the given address
 */
async function verifyContractExists(provider, contractAddress) {
  try {
    const code = await provider.getCode(contractAddress);

    // '0x' or '0x0' means no contract at this address
    if (!code || code === '0x' || code === '0x0') {
      throw new Error(
        `No contract found at address ${contractAddress}. ` +
        `This could mean:\n` +
        `1. Contract not deployed to this network\n` +
        `2. Wrong contract address in contracts.json\n` +
        `3. Connected to wrong network\n` +
        `4. Local blockchain node not running (if using Hardhat)`
      );
    }

    return true;
  } catch (error) {
    if (error.message.includes('No contract found')) {
      throw error;
    }
    throw new Error(`Failed to verify contract existence: ${error.message}`);
  }
}

/**
 * Get a properly configured provider
 * Priority: MetaMask > Fallback RPC
 */
async function getProvider() {
  const expectedNetwork = getExpectedNetwork();

  // Try MetaMask first (for read operations, we don't need a signer)
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Verify we're on the correct network
      await verifyNetwork(provider);

      console.log(`✅ Using MetaMask provider on ${expectedNetwork.name}`);
      return provider;
    } catch (error) {
      console.warn(`⚠️ MetaMask provider error: ${error.message}`);
      console.log('Falling back to RPC provider...');
    }
  }

  // Fallback to direct RPC connection
  console.log(`Using fallback RPC provider: ${expectedNetwork.rpcUrl}`);
  return new ethers.JsonRpcProvider(expectedNetwork.rpcUrl);
}

/**
 * Main function to get user balance from vault
 * 
 * @param {string} address - The user's Ethereum address
 * @returns {Promise<string>} The balance formatted as a string with 6 decimals (USDT units)
 * 
 * @example
 * const balance = await getUserBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
 * console.log(balance); // "100.250000"
 */
export async function getUserBalance(address) {
  console.log('🔍 getUserBalance called with address:', address);

  try {
    // ========================================
    // Step 1: Validate Input Address
    // ========================================
    if (!address) {
      throw new Error('Address is required');
    }

    if (typeof address !== 'string') {
      throw new Error(`Address must be a string, got ${typeof address}`);
    }

    // Check if address is valid Ethereum address format
    if (!ethers.isAddress(address)) {
      throw new Error(
        `Invalid Ethereum address format: ${address}. ` +
        `Address must be a valid 42-character hex string starting with 0x`
      );
    }

    // Normalize address to checksum format
    const checksumAddress = ethers.getAddress(address);
    console.log('✅ Address validated:', checksumAddress);

    // ========================================
    // Step 2: Verify Configuration
    // ========================================
    if (!contractsData?.contracts?.SenteVault) {
      throw new Error(
        'SenteVault contract address not found in contracts.json. ' +
        'Please ensure contracts are deployed and contracts.json is up to date.'
      );
    }

    const vaultAddress = contractsData.contracts.SenteVault;
    console.log('📋 Vault address:', vaultAddress);
    console.log('🌐 Expected network:', getExpectedNetwork().name);

    // ========================================
    // Step 3: Get Provider
    // ========================================
    const provider = await getProvider();
    console.log('✅ Provider initialized');

    // ========================================
    // Step 4: Verify Contract Exists
    // ========================================
    await verifyContractExists(provider, vaultAddress);
    console.log('✅ Contract verified at address');

    // ========================================
    // Step 5: Create Contract Instance
    // ========================================
    const vaultContract = new ethers.Contract(
      vaultAddress,
      SenteVaultABI,
      provider
    );
    console.log('✅ Contract instance created');

    // ========================================
    // Step 6: Call getBalance Method
    // ========================================
    console.log('📞 Calling vault.getBalance()...');

    let rawBalance;
    try {
      rawBalance = await vaultContract.getBalance(checksumAddress);
      console.log('✅ Raw balance received:', rawBalance.toString());
    } catch (contractError) {
      // Enhanced error handling for contract call failures
      const errorMessage = contractError.message || contractError.toString();

      if (errorMessage.includes('could not decode result data')) {
        throw new Error(
          'Failed to decode contract response. This usually means:\n' +
          `1. Contract not deployed at ${vaultAddress}\n` +
          '2. Wrong network (check MetaMask network)\n' +
          '3. ABI mismatch with deployed contract\n' +
          '4. Local blockchain not running (if using Hardhat)\n\n' +
          `Original error: ${errorMessage}`
        );
      }

      if (errorMessage.includes('network')) {
        throw new Error(
          `Network connection error: ${errorMessage}\n` +
          'Please check:\n' +
          '1. Internet connection\n' +
          '2. RPC endpoint is accessible\n' +
          '3. Local blockchain is running (if applicable)'
        );
      }

      throw new Error(`Contract call failed: ${errorMessage}`);
    }

    // ========================================
    // Step 7: Format Balance
    // ========================================
    // USDT uses 6 decimals
    const USDT_DECIMALS = 6;
    const formattedBalance = ethers.formatUnits(rawBalance, USDT_DECIMALS);

    console.log('💰 Formatted balance:', formattedBalance, 'sUSDT');
    console.log('✅ getUserBalance completed successfully');

    return formattedBalance;

  } catch (error) {
    // ========================================
    // Comprehensive Error Logging
    // ========================================
    console.error('❌ getUserBalance Error:', {
      message: error.message,
      address: address,
      vaultAddress: contractsData?.contracts?.SenteVault,
      network: contractsData?.network,
      chainId: contractsData?.chainId,
      stack: error.stack,
    });

    // Return '0' for UI stability, but log the full error
    // Alternative: throw error; (if you want to handle it in the calling component)
    return '0';
  }
}

/**
 * Helper function to check if user is on the correct network
 * @returns {Promise<boolean>} True if on correct network, false otherwise
 */
export async function isOnCorrectNetwork() {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const currentChainId = Number(network.chainId);
    const expectedChainId = parseInt(contractsData.chainId);

    return currentChainId === expectedChainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

/**
 * Helper function to get current network info
 * @returns {Promise<Object>} Network information
 */
export async function getCurrentNetworkInfo() {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return { connected: false };
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const expectedNetwork = getExpectedNetwork();

    return {
      connected: true,
      currentChainId: Number(network.chainId),
      currentChainName: network.name,
      expectedChainId: expectedNetwork.chainId,
      expectedChainName: expectedNetwork.name,
      isCorrectNetwork: Number(network.chainId) === expectedNetwork.chainId,
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return { connected: false, error: error.message };
  }
}

/**
 * Helper function to switch to the correct network
 * @returns {Promise<boolean>} True if switch successful
 */
export async function switchToCorrectNetwork() {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not available');
    }

    const expectedNetwork = getExpectedNetwork();

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: expectedNetwork.chainIdHex }],
    });

    return true;
  } catch (error) {
    // If network doesn't exist, try to add it
    if (error.code === 4902) {
      const expectedNetwork = getExpectedNetwork();

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: expectedNetwork.chainIdHex,
          chainName: expectedNetwork.name,
          rpcUrls: [expectedNetwork.rpcUrl],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
        }],
      });

      return true;
    }

    throw error;
  }
}

// Export all functions
export default getUserBalance;
