// Base Sepolia testnet configuration
export const BASE_SEPOLIA_CONFIG = {
  chainId: '0x14A34', // 84532
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
};

// Function to switch to Base Sepolia network
export const switchToBaseSepolia = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      // Try to switch to the network first
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CONFIG.chainId }],
      });
      return true;
    } catch (switchError) {
      // This error code means the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        // Chain not added, let's add it
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BASE_SEPOLIA_CONFIG],
        });
        return true;
      } else if (switchError.code === 4001) {
        // User rejected the request
        const error = new Error('User rejected network switch');
        error.code = 4001;
        throw error;
      } else if (switchError.code === -32002) {
        // Request already pending
        const error = new Error('Network switch request already pending in MetaMask');
        error.code = -32002;
        throw error;
      } else {
        // Other errors
        throw switchError;
      }
    }
  } catch (error) {
    console.error('Failed to switch network:', error);
    // Re-throw the original error with its code
    throw error;
  }
};

// Function to check if currently on Base Sepolia
export const isBaseSepolia = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === BASE_SEPOLIA_CONFIG.chainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

// Get network configuration details for manual setup
export const getBaseSepoliaNetworkDetails = () => {
  return {
    networkName: BASE_SEPOLIA_CONFIG.chainName,
    rpcUrl: BASE_SEPOLIA_CONFIG.rpcUrls[0],
    chainId: parseInt(BASE_SEPOLIA_CONFIG.chainId, 16), // Convert hex to decimal
    chainIdHex: BASE_SEPOLIA_CONFIG.chainId,
    currencySymbol: BASE_SEPOLIA_CONFIG.nativeCurrency.symbol,
    blockExplorer: BASE_SEPOLIA_CONFIG.blockExplorerUrls[0],
  };
};