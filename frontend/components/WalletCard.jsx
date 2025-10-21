import { useState, useEffect } from 'react';
import { getUserBalance, getSavingsBalance, getUnlockTime, getFaucetTokens } from '../utils/contract';
import toast from 'react-hot-toast';

export default function WalletCard({ userAddress, onBalanceUpdate }) {
  const [balance, setBalance] = useState('0');
  const [savingsBalance, setSavingsBalance] = useState('0');
  const [unlockTime, setUnlockTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (userAddress) {
      loadBalances();
    }
  }, [userAddress]);

  const loadBalances = async () => {
    try {
      setLoading(true);
      const [bal, savBal, unlock] = await Promise.all([
        getUserBalance(userAddress),
        getSavingsBalance(userAddress),
        getUnlockTime(userAddress),
      ]);

      setBalance(bal);
      setSavingsBalance(savBal);
      setUnlockTime(unlock);

      if (onBalanceUpdate) {
        onBalanceUpdate(bal, savBal);
      }
    } catch (error) {
      console.error('Error loading balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimFaucet = async () => {
    try {
      setClaiming(true);
      toast.loading('Claiming 100 sUSDT from faucet...');

      const tx = await getFaucetTokens(100);

      toast.dismiss();
      toast.success(`Claimed 100 sUSDT! 🎉 TX: ${tx.hash.slice(0, 10)}...`);

      // Reload balances
      setTimeout(() => loadBalances(), 2000);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to claim tokens: ' + error.message);
      console.error('Faucet error:', error);
    } finally {
      setClaiming(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const isLocked = unlockTime > Date.now() / 1000;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">💼 My Wallet</h2>
        <button
          onClick={loadBalances}
          disabled={loading}
          className="text-primary hover:text-primary-dark"
        >
          🔄 {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Available Balance */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 mb-4 text-white">
        <p className="text-sm opacity-90 mb-1">Available Balance</p>
        <p className="text-4xl font-bold mb-2">
          {loading ? '...' : parseFloat(balance).toFixed(2)} sUSDT
        </p>
        <p className="text-xs opacity-75">≈ ${loading ? '...' : parseFloat(balance).toFixed(2)} USD</p>
      </div>

      {/* Savings Balance */}
      <div className="bg-gradient-to-r from-accent to-yellow-500 rounded-lg p-4 mb-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs opacity-90 mb-1">🔒 Savings Vault</p>
            <p className="text-2xl font-bold">
              {loading ? '...' : parseFloat(savingsBalance).toFixed(2)} sUSDT
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">Unlock Date</p>
            <p className="text-sm font-semibold">{formatDate(unlockTime)}</p>
            {isLocked && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded mt-1 inline-block">
                Locked 🔒
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Faucet Button */}
      <button
        onClick={handleClaimFaucet}
        disabled={claiming || loading}
        className="w-full btn-secondary text-sm"
      >
        {claiming ? '⏳ Claiming...' : '🚰 Claim 100 sUSDT (Testnet Faucet)'}
      </button>
    </div>
  );
}
