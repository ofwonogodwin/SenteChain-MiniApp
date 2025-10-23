import { ethers } from 'ethers';
import contractsData from '../config/contracts.json';
import { getVaultContract, getTokenContract } from './contract';

export const checkSetup = async () => {
    try {
        console.log('🔍 Starting setup check...');

        // 1. Check MetaMask Installation
        if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error('❌ MetaMask not installed. Please install MetaMask extension.');
        }
        console.log('✅ MetaMask is installed');

        // 2. Check Wallet Connection
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('✅ Wallet connected:', accounts[0]);

        // 3. Check Network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x14A34') { // 84532 in hex
            throw new Error(`❌ Wrong network. Please switch to Base Sepolia (Chain ID: 84532). Current chain: ${parseInt(chainId, 16)}`);
        }
        console.log('✅ Connected to Base Sepolia network');

        // 4. Check Contract Deployment
        const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');

        // Check Token Contract
        const tokenCode = await provider.getCode(contractsData.contracts.SenteToken);
        if (tokenCode === '0x' || tokenCode === '0x0') {
            throw new Error('❌ SenteToken contract not deployed');
        }
        console.log('✅ SenteToken contract deployed at:', contractsData.contracts.SenteToken);

        // Check Vault Contract
        const vaultCode = await provider.getCode(contractsData.contracts.SenteVault);
        if (vaultCode === '0x' || vaultCode === '0x0') {
            throw new Error('❌ SenteVault contract not deployed');
        }
        console.log('✅ SenteVault contract deployed at:', contractsData.contracts.SenteVault);

        // 5. Test Contract Interactions
        const vault = await getVaultContract();
        const token = await getTokenContract();

        // Try reading from contracts
        const balance = await vault.getBalance(accounts[0]);
        console.log('✅ Contract read successful. Your balance:', ethers.formatUnits(balance, 6), 'sUSDT');

        console.log('🎉 Setup check completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ Setup check failed:', error.message);
        return false;
    }
};

// Usage in your components:
// import { checkSetup } from '../utils/checkSetup';
// const isSetupOk = await checkSetup();