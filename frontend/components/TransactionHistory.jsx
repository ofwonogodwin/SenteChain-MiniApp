import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getExplorerLink, formatTxHash } from '../utils/contract';
import { BASE_SEPOLIA_CONFIG } from '../utils/networkConfig';
import contractsData from '../config/contracts.json';

export default function TransactionHistory({ userAddress }) {
  // Mock demo transactions for demonstration
  const mockTransactions = [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      to: userAddress,
      value: '5.00',
      timestamp: Date.now() - 300000, // 5 minutes ago
      type: 'received',
      blockNumber: 32724000
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      from: userAddress,
      to: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
      value: '2.50',
      timestamp: Date.now() - 600000, // 10 minutes ago
      type: 'sent',
      blockNumber: 32723950
    },
    {
      hash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      from: '0x1234567890123456789012345678901234567890',
      to: userAddress,
      value: '10.00',
      timestamp: Date.now() - 1800000, // 30 minutes ago
      type: 'received',
      blockNumber: 32723800
    },
    {
      hash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      from: userAddress,
      to: '0x5678901234567890123456789012345678901234',
      value: '3.75',
      timestamp: Date.now() - 3600000, // 1 hour ago
      type: 'sent',
      blockNumber: 32723700
    },
    {
      hash: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
      from: '0x9999888877776666555544443333222211110000',
      to: userAddress,
      value: '7.25',
      timestamp: Date.now() - 7200000, // 2 hours ago
      type: 'received',
      blockNumber: 32723500
    }
  ];

  const [transactions, setTransactions] = useState(mockTransactions); // Use mock data
  const [loading, setLoading] = useState(false); // No loading for demo
  const [filter, setFilter] = useState('all'); // all, sent, received

  useEffect(() => {
    // Comment out real fetch for demo - using mock data instead
    // if (userAddress) {
    //   fetchTransactions();
    // }
  }, [userAddress]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // Use Base Sepolia RPC or the configured RPC
      const rpcUrl = contractsData.rpcUrl || BASE_SEPOLIA_CONFIG.rpcUrls[0];
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      // Get the token contract
      const tokenAbi = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
      const tokenContract = new ethers.Contract(
        contractsData.contracts.SenteToken,
        tokenAbi,
        provider
      );

      // Get current block
      const currentBlock = await provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000); // Last ~10k blocks

      console.log('Fetching transactions from block', fromBlock, 'to', currentBlock);

      // Fetch Transfer events involving the user
      const sentFilter = tokenContract.filters.Transfer(userAddress, null);
      const receivedFilter = tokenContract.filters.Transfer(null, userAddress);

      const [sentEvents, receivedEvents] = await Promise.all([
        tokenContract.queryFilter(sentFilter, fromBlock, currentBlock),
        tokenContract.queryFilter(receivedFilter, fromBlock, currentBlock)
      ]);

      // Combine and format transactions
      const allTxs = [];

      for (const event of sentEvents) {
        const block = await provider.getBlock(event.blockNumber);
        allTxs.push({
          hash: event.transactionHash,
          from: event.args.from,
          to: event.args.to,
          value: ethers.formatUnits(event.args.value, 6), // 6 decimals for USDT
          timestamp: block.timestamp * 1000,
          type: 'sent',
          blockNumber: event.blockNumber
        });
      }

      for (const event of receivedEvents) {
        // Skip if it's also in sent (already added)
        if (sentEvents.find(e => e.transactionHash === event.transactionHash)) {
          continue;
        }
        const block = await provider.getBlock(event.blockNumber);
        allTxs.push({
          hash: event.transactionHash,
          from: event.args.from,
          to: event.args.to,
          value: ethers.formatUnits(event.args.value, 6), // 6 decimals for USDT
          timestamp: block.timestamp * 1000,
          type: 'received',
          blockNumber: event.blockNumber
        });
      }

      // Sort by timestamp (newest first)
      allTxs.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(allTxs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <button
          onClick={fetchTransactions}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-4 font-medium transition-colors ${filter === 'all'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`pb-2 px-4 font-medium transition-colors ${filter === 'sent'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Sent
        </button>
        <button
          onClick={() => setFilter('received')}
          className={`pb-2 px-4 font-medium transition-colors ${filter === 'received'
            ? 'text-primary border-b-2 border-primary'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Received
        </button>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.hash}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'sent'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                    }`}
                >
                  {tx.type === 'sent' ? '↑' : '↓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-gray-900">
                      {tx.type === 'sent' ? 'Sent' : 'Received'}
                    </p>
                    <a
                      href={getExplorerLink(tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {formatTxHash(tx.hash)}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">
                    {tx.type === 'sent' ? 'To: ' : 'From: '}
                    {formatAddress(tx.type === 'sent' ? tx.to : tx.from)}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(tx.timestamp)}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                      }`}
                  >
                    {tx.type === 'sent' ? '-' : '+'}
                    {parseFloat(tx.value).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">sUSDT</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
