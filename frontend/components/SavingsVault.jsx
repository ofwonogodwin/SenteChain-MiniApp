import { useState } from 'react';
import { saveToVault, withdrawFromVault, isSavingsUnlocked, getUserBalance } from '../utils/contract';
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

    // DEMO MODE: Simulate the transaction for demonstration
    const isDemoMode = true; // Set to false to use real blockchain

    if (isDemoMode) {
      try {
        setLoading(true);
        
        // Simulate checking balance
        toast.loading('Locking tokens in savings vault...');
        
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.dismiss();
        toast.success(
          <div>
            <p className="font-bold">✅ Tokens locked successfully! (Demo)</p>
            <p className="text-xs mt-1">Deposited {amount} sUSDT for {lockDays} days</p>
            <p className="text-xs text-gray-500 mt-1">Demo transaction - no real blockchain TX</p>
          </div>,
          { duration: 5000 }
        );

        console.log('Demo transaction confirmed');

        setAmount('');
        
        // Trigger balance refresh
        if (onSuccess) {
          onSuccess();
          setTimeout(() => onSuccess(), 1000);
          setTimeout(() => onSuccess(), 3000);
        }
        
        setLoading(false);
        return;
      } catch (error) {
        toast.dismiss();
        toast.error('Demo transaction failed');
        setLoading(false);
        return;
      }
    }

    // REAL BLOCKCHAIN MODE (original code)
    try {
      setLoading(true);

      // First check if user has enough balance
      console.log('Checking user balance...');
      const balance = await getUserBalance(userAddress);
      const balanceNum = parseFloat(balance);
      const amountNum = parseFloat(amount);

      console.log('User balance:', balanceNum, 'Requested amount:', amountNum);

      if (balanceNum < amountNum) {
        toast.dismiss();
        toast.error(
          <div>
            <p className="font-bold">Insufficient Balance</p>
            <p className="text-xs mt-1">
              You have {balanceNum} sUSDT but trying to lock {amountNum} sUSDT
            </p>
            <p className="text-xs mt-1">
              💡 Claim free tokens from the faucet first!
            </p>
          </div>,
          { duration: 5000 }
        );
        setLoading(false);
        return;
      }

      toast.loading('Locking tokens in savings vault...');

      const tx = await saveToVault(amount, parseInt(lockDays));

      toast.dismiss();
      toast.loading('Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      toast.dismiss();
      toast.success(
        <div>
          <p className="font-bold">✅ Tokens locked successfully!</p>
          <p className="text-xs mt-1">Deposited {amount} sUSDT for {lockDays} days</p>
          <a
            href={getExplorerLink(tx.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs"
          >
            View TX: {formatTxHash(tx.hash)}
          </a>
        </div>,
        { duration: 5000 }
      );

      console.log('Transaction confirmed:', receipt);

      setAmount('');
      
      // Trigger multiple refreshes to ensure balances update
      if (onSuccess) {
        // Immediate refresh
        onSuccess();
        
        // Refresh after 1 second (blockchain needs time to update)
        setTimeout(() => {
          console.log('Refreshing balances after 1s...');
          onSuccess();
        }, 1000);
        
        // Final refresh after 3 seconds
        setTimeout(() => {
          console.log('Final balance refresh after 3s...');
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      toast.dismiss();
      
      console.error('Savings deposit error:', error);
      
      // Provide detailed error messages
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected');
      } else if (error.message?.includes('insufficient funds') || error.message?.includes('insufficient balance')) {
        toast.error(
          <div>
            <p className="font-bold">Insufficient Balance</p>
            <p className="text-xs mt-1">Claim tokens from the faucet first!</p>
          </div>
        );
      } else if (error.message?.includes('user rejected')) {
        toast.error('Transaction cancelled');
      } else if (error.code === 'CALL_EXCEPTION') {
        toast.error(
          <div>
            <p className="font-bold">Transaction Failed</p>
            <p className="text-xs mt-1">
              Make sure you have enough tokens. Claim from faucet first!
            </p>
          </div>
        );
      } else {
        toast.error('Failed to lock tokens: ' + (error.reason || error.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };  const handleWithdraw = async (e) => {
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
      toast.loading('Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      toast.dismiss();
      toast.success(
        <div>
          <p className="font-bold">✅ Withdrawal successful!</p>
          <p className="text-xs mt-1">Withdrew {amount} sUSDT</p>
          <a
            href={getExplorerLink(tx.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-xs"
          >
            View TX: {formatTxHash(tx.hash)}
          </a>
        </div>,
        { duration: 5000 }
      );

      console.log('Withdrawal confirmed:', receipt);

      setAmount('');

      // Trigger multiple refreshes
      if (onSuccess) {
        onSuccess();
        setTimeout(() => {
          console.log('Refreshing balances after 1s...');
          onSuccess();
        }, 1000);
        setTimeout(() => {
          console.log('Final balance refresh after 3s...');
          onSuccess();
        }, 3000);
      }
    } catch (error) {
      toast.dismiss();

      if (error.code === 4001) {
        toast.error('Transaction rejected');
      } else if (error.message?.includes('insufficient')) {
        toast.error('Insufficient savings balance');
      } else {
        toast.error('Withdrawal failed: ' + (error.reason || error.message || 'Unknown error'));
      }

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

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 mb-2">
              💡 <strong>Before locking:</strong> Make sure you have claimed tokens from the faucet in your wallet!
            </p>
            <p className="text-xs text-blue-800">
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
