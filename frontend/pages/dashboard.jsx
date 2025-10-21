import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import WalletCard from '../components/WalletCard';
import SendForm from '../components/SendForm';
import SavingsVault from '../components/SavingsVault';
import { connectWallet, isMetaMaskInstalled, onAccountsChanged, onChainChanged } from '../utils/connectWallet';
import { approveTokens, depositTokens } from '../utils/contract';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

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
      toast.success('Wallet connected! 🎉');
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
      toast.success(`Deposited ${amount} sUSDT to vault! 🎉`);
      
      // Refresh balances
      setRefreshKey(prev => prev + 1);
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
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-900">Connect MetaMask</p>
                    <p className="text-sm text-yellow-700">
                      Connect your wallet to interact with Base blockchain
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
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <p className="font-semibold text-green-900">Wallet Connected</p>
                    <p className="text-sm text-green-700">
                      You're connected to Base Sepolia
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDepositToVault}
                  className="btn-secondary text-sm whitespace-nowrap"
                >
                  💰 Deposit to Vault
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
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-sm">Transactions</p>
            </button>
            <button className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-2">👥</div>
              <p className="font-semibold text-sm">Contacts</p>
            </button>
            <button className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-2">⚙️</div>
              <p className="font-semibold text-sm">Settings</p>
            </button>
            <button className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-3xl mb-2">📱</div>
              <p className="font-semibold text-sm">QR Code</p>
            </button>
          </div>

          {/* Info Footer */}
          <div className="mt-8 bg-primary bg-opacity-10 border border-primary rounded-lg p-6">
            <h3 className="font-bold text-primary mb-3">🚀 Demo Mode</h3>
            <p className="text-sm text-gray-700 mb-2">
              This is a testnet demo running on Base Sepolia. All transactions are for testing purposes only.
            </p>
            <p className="text-xs text-gray-600">
              Contract addresses and deployment info will be displayed here after deployment.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
