import { useState } from 'react';
import { saveToVault, withdrawFromVault, isSavingsUnlocked } from '../utils/contract';
import toast from 'react-hot-toast';
import { getExplorerLink, formatTxHash } from '../utils/contract';

export default function SavingsVault({ userAddress, onSuccess }) {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('');
  const [lockDays, setLockDays] = useState('30');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!lockDays || parseInt(lockDays) < 1) {
      toast.error('Lock period must be at least 1 day');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Locking tokens in savings vault...');

      const tx = await saveToVault(amount, parseInt(lockDays));

      toast.dismiss();
      toast.success(
        <div>
          <p>Tokens locked successfully!</p>
          <a
            href={getExplorerLink(tx.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs"
          >
            View TX: {formatTxHash(tx.hash)}
          </a>
        </div>
      );

      setAmount('');
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to lock tokens: ' + (error.message || 'Unknown error'));
      console.error('Savings deposit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      // Check if savings are unlocked
      const unlocked = await isSavingsUnlocked(userAddress);
      if (!unlocked) {
        toast.error('Your savings are still locked. Please wait until the unlock date.');
        return;
      }

      setLoading(true);
      toast.loading('Withdrawing from savings vault...');

      const tx = await withdrawFromVault(amount);

      toast.dismiss();
      toast.success(
        <div>
          <p>Withdrawal successful!</p>
          <a
            href={getExplorerLink(tx.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs"
          >
            View TX: {formatTxHash(tx.hash)}
          </a>
        </div>
      );

      setAmount('');
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Withdrawal failed: ' + (error.message || 'Unknown error'));
      console.error('Savings withdrawal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Savings Vault</h2>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'deposit'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Lock Savings
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === 'withdraw'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          Withdraw
        </button>
      </div>

      {/* Deposit Form */}
      {activeTab === 'deposit' && (
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="label">Amount to Lock (sUSDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-field"
              disabled={loading}
            />
          </div>

          <div>
            <label className="label">Lock Period (Days)</label>
            <select
              value={lockDays}
              onChange={(e) => setLockDays(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="7">7 Days (1 Week)</option>
              <option value="30">30 Days (1 Month)</option>
              <option value="90">90 Days (3 Months)</option>
              <option value="180">180 Days (6 Months)</option>
              <option value="365">365 Days (1 Year)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full btn-primary"
          >
            {loading ? 'Locking...' : 'Lock in Savings'}
          </button>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800">
              Your tokens will be locked for {lockDays} days. You can withdraw them after
              the lock period ends.
            </p>
          </div>
        </form>
      )}

      {/* Withdraw Form */}
      {activeTab === 'withdraw' && (
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="label">Amount to Withdraw (sUSDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-field"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full btn-primary"
          >
            {loading ? 'Withdrawing...' : 'Withdraw from Savings'}
          </button>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              You can only withdraw if your lock period has ended. Check your wallet card
              for the unlock date.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
