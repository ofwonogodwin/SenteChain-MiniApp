import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import WalletCard from '../components/WalletCard';
import SendForm from '../components/SendForm';
import SavingsVault from '../components/SavingsVault';
import TransactionHistory from '../components/TransactionHistory';
import Settings from '../components/Settings';
import QRCode from '../components/QRCode';
import { connectWallet, isMetaMaskInstalled, onAccountsChanged, onChainChanged } from '../utils/connectWallet';
import { approveTokens, depositTokens } from '../utils/contract';
import contractsData from '../config/contracts.json';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // null, 'transactions', 'contacts', 'settings', 'qr'
  const router = useRouter();

  // Get network display name
  const getNetworkName = () => {
    if (contractsData?.network === 'localhost' || contractsData?.chainId === '1337') {
      return 'Hardhat Local Network';
    }
    return 'Base Sepolia';
  };

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('sentechain_user');
    if (!userData) {
      router.push('/');
      return;
    }

    setUser(JSON.parse(userData));

    // Listen for wallet changes
    if (isMetaMaskInstalled()) {
      onAccountsChanged((account) => {
        if (!account) {
          setWalletConnected(false);
        }
      });

      onChainChanged(() => {
        window.location.reload();
      });
    }
  }, [router]);

  const handleConnectWallet = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        toast.error('Please install MetaMask to use this feature');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      toast.loading('Connecting to MetaMask...');
      const account = await connectWallet();

      toast.dismiss();
      toast.success('Wallet connected! ');
      setWalletConnected(true);
    } catch (error) {
      toast.dismiss();
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    }
  };

  const handleDepositToVault = async () => {
    try {
      if (!walletConnected) {
        toast.error('Please connect your wallet first');
        return;
      }

      const amount = prompt('Enter amount to deposit to vault:');
      if (!amount || parseFloat(amount) <= 0) {
        return;
      }

      toast.loading('Approving tokens...');
      await approveTokens(amount);

      toast.dismiss();
      toast.loading('Depositing to vault...');
      const tx = await depositTokens(amount);

      toast.dismiss();
      toast.success(`Deposited ${amount} sUSDT to vault!`);

      // Wait a moment for blockchain state to update, then refresh balances
      setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 1500);
    } catch (error) {
      toast.dismiss();
      console.error('Deposit error:', error);
      toast.error('Deposit failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sentechain_user');
    localStorage.removeItem('sentechain_token');
    router.push('/');
  };

  const handleBalanceUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - SenteChain</title>
        <meta name="description" content="Manage your SenteChain wallet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Connection Status */}
          <div className="mb-6">
            {!walletConnected ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3"></span>
                  <div>
                    <p className="font-semibold text-yellow-900">Connect MetaMask</p>
                    <p className="text-sm text-yellow-700">
                      Connect your wallet to interact with {getNetworkName()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConnectWallet}
                  className="btn-primary whitespace-nowrap"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div>
                    <p className="font-semibold text-green-900">Wallet Connected</p>
                    <p className="text-sm text-green-700">
                      Connected to {getNetworkName()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDepositToVault}
                  className="btn-secondary text-sm whitespace-nowrap"
                >
                  Deposit to Vault
                </button>
              </div>
            )}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Wallet Card */}
            <div className="lg:col-span-1">
              <WalletCard
                key={refreshKey}
                userAddress={user.walletAddress}
                onBalanceUpdate={handleBalanceUpdate}
              />
            </div>

            {/* Middle Column - Send Form */}
            <div className="lg:col-span-1">
              <SendForm onSuccess={handleBalanceUpdate} />
            </div>

            {/* Right Column - Savings Vault */}
            <div className="lg:col-span-1">
              <SavingsVault
                userAddress={user.walletAddress}
                onSuccess={handleBalanceUpdate}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-3 gap-6">
            <button
              onClick={() => setActiveModal('transactions')}
              className="card text-center hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200"
            >
              <div className="text-4xl mb-3"></div>
              <p className="font-bold text-base text-purple-900">Transactions</p>
              <p className="text-xs text-purple-600 mt-1">View history</p>
            </button>
            <button
              onClick={() => setActiveModal('settings')}
              className="card text-center hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
            >
              <div className="text-4xl mb-3">⚙️</div>
              <p className="font-bold text-base text-blue-900">Settings</p>
              <p className="text-xs text-blue-600 mt-1">Manage account</p>
            </button>
            <button
              onClick={() => setActiveModal('qr')}
              className="card text-center hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
            >
              <div className="text-4xl mb-3"></div>
              <p className="font-bold text-base text-green-900">QR Code</p>
              <p className="text-xs text-green-600 mt-1">Receive payments</p>
            </button>
          </div>

          {/* Info Footer */}
          <div className="mt-8 bg-primary bg-opacity-10 border border-primary rounded-lg p-6">
            <h3 className="font-bold text-primary mb-3">Demo Mode</h3>
            <p className="text-sm text-gray-700 mb-2">
              This is a testnet demo running on {getNetworkName()}. All transactions are for testing purposes only.
            </p>
            <p className="text-xs text-gray-600">
              Token: {contractsData.contracts?.SenteToken || 'Not deployed'}
            </p>
          </div>
        </div>

        {/* Modal Overlays */}
        {activeModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {activeModal === 'transactions' && 'Transaction History'}
                  {activeModal === 'settings' && 'Settings'}
                  {activeModal === 'qr' && 'QR Code'}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {activeModal === 'transactions' && (
                  <TransactionHistory userAddress={user.walletAddress} />
                )}
                {activeModal === 'settings' && <Settings user={user} />}
                {activeModal === 'qr' && (
                  <QRCode walletAddress={user.walletAddress} username={user.username} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
