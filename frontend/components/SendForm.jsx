import { useState } from 'react';
import { transferTokens } from '../utils/contract';
import toast from 'react-hot-toast';
import { getExplorerLink, formatTxHash } from '../utils/contract';

export default function SendForm({ onSuccess }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      toast.loading('Sending sUSDT...');

      const tx = await transferTokens(recipient, amount);

      toast.dismiss();
      toast.loading('Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      toast.dismiss();
      toast.success(
        <div>
          <p className="font-bold">✅ Transfer successful!</p>
          <p className="text-xs mt-1">Sent {amount} sUSDT</p>
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

      console.log('Transfer confirmed:', receipt);

      // Reset form
      setRecipient('');
      setAmount('');

      // Trigger multiple balance refreshes
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
        toast.error('Insufficient balance');
      } else {
        toast.error('Transfer failed: ' + (error.reason || error.message || 'Unknown error'));
      }

      console.error('Transfer error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Send sUSDT</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient */}
        <div>
          <label className="label">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="input-field"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the wallet address of the recipient
          </p>
        </div>

        {/* Amount */}
        <div>
          <label className="label">Amount (sUSDT)</label>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !recipient || !amount}
          className="w-full btn-primary"
        >
          {loading ? 'Sending...' : 'Send Now'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Transfers happen instantly within the SenteChain vault.
          No gas fees on transfers between SenteChain users!
        </p>
      </div>
    </div>
  );
}
