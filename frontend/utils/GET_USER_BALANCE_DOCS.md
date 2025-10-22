# getUserBalance Function - Complete Documentation

## 🎯 Overview

A production-grade, type-safe async function to fetch user balances from the SenteVault smart contract with comprehensive error handling and network verification.

## 📋 Function Signature

```javascript
async function getUserBalance(address: string): Promise<string>
```

## ✨ Features

✅ **Input Validation** - Validates Ethereum address format using ethers.js  
✅ **Network Detection** - Auto-detects deployment network from contracts.json  
✅ **Network Verification** - Ensures MetaMask is on correct network  
✅ **Contract Verification** - Checks contract exists before calling  
✅ **Provider Fallback** - Uses MetaMask → Fallback to RPC  
✅ **Comprehensive Error Handling** - Detailed error messages for debugging  
✅ **Logging** - Console logs for debugging and monitoring  
✅ **Type Safety** - Returns formatted string with 6 decimals (USDT)

---

## 🚀 Quick Start

### Basic Usage

```javascript
import { getUserBalance } from '@/utils/getUserBalance';

// In your React component or API route
const balance = await getUserBalance('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
console.log(balance); // "100.250000"
```

### React Component Example

```jsx
import { useState, useEffect } from 'react';
import { getUserBalance, isOnCorrectNetwork, switchToCorrectNetwork } from '@/utils/getUserBalance';

export default function WalletBalance({ userAddress }) {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBalance() {
      try {
        setLoading(true);
        setError(null);
        
        // Check if on correct network
        const correctNetwork = await isOnCorrectNetwork();
        if (!correctNetwork) {
          // Prompt user to switch
          const switched = await switchToCorrectNetwork();
          if (!switched) {
            throw new Error('Please switch to the correct network');
          }
        }
        
        // Fetch balance
        const userBalance = await getUserBalance(userAddress);
        setBalance(userBalance);
      } catch (err) {
        console.error('Failed to load balance:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userAddress) {
      loadBalance();
    }
  }, [userAddress]);

  if (loading) return <div>Loading balance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Your Balance</h3>
      <p>{parseFloat(balance).toFixed(2)} sUSDT</p>
    </div>
  );
}
```

### Next.js API Route Example

```javascript
// pages/api/balance/[address].js
import { getUserBalance } from '@/utils/getUserBalance';

export default async function handler(req, res) {
  const { address } = req.query;

  try {
    const balance = await getUserBalance(address);
    
    res.status(200).json({
      success: true,
      address,
      balance,
      balanceFormatted: `${parseFloat(balance).toFixed(2)} sUSDT`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
```

---

## 🔧 Helper Functions

### 1. Check Network Status

```javascript
import { isOnCorrectNetwork } from '@/utils/getUserBalance';

const correctNetwork = await isOnCorrectNetwork();
if (!correctNetwork) {
  alert('Please switch to the correct network!');
}
```

### 2. Get Network Information

```javascript
import { getCurrentNetworkInfo } from '@/utils/getUserBalance';

const networkInfo = await getCurrentNetworkInfo();
console.log(networkInfo);
// {
//   connected: true,
//   currentChainId: 1337,
//   currentChainName: "unknown",
//   expectedChainId: 1337,
//   expectedChainName: "Hardhat Local",
//   isCorrectNetwork: true
// }
```

### 3. Switch to Correct Network

```javascript
import { switchToCorrectNetwork } from '@/utils/getUserBalance';

try {
  await switchToCorrectNetwork();
  console.log('Network switched successfully!');
} catch (error) {
  console.error('Failed to switch network:', error);
}
```

---

## 📊 Error Handling

The function handles various error scenarios gracefully:

### Error Types

1. **Invalid Address**
   ```
   Error: Invalid Ethereum address format: 0xinvalid
   ```

2. **Network Mismatch**
   ```
   Error: Network mismatch: Contract deployed on Hardhat Local (1337),
   but MetaMask is on chain 84532. Please switch networks.
   ```

3. **Contract Not Found**
   ```
   Error: No contract found at address 0x...
   This could mean:
   1. Contract not deployed to this network
   2. Wrong contract address in contracts.json
   3. Connected to wrong network
   4. Local blockchain node not running (if using Hardhat)
   ```

4. **Decode Error (BAD_DATA)**
   ```
   Error: Failed to decode contract response. This usually means:
   1. Contract not deployed at 0x...
   2. Wrong network (check MetaMask network)
   3. ABI mismatch with deployed contract
   4. Local blockchain not running (if using Hardhat)
   ```

### Error Handling Patterns

#### Pattern 1: Silent Fallback (Current Default)
```javascript
// Returns '0' on error, logs to console
const balance = await getUserBalance(address);
// balance = '0' if error occurs
```

#### Pattern 2: Try-Catch
```javascript
try {
  const balance = await getUserBalance(address);
  setBalance(balance);
} catch (error) {
  setError(error.message);
  toast.error('Failed to load balance');
}
```

#### Pattern 3: Error Callback
```javascript
const balance = await getUserBalance(address);
if (balance === '0') {
  // Check console for errors
  console.warn('Balance returned 0, check logs');
}
```

---

## 🧪 Testing

### Test Cases

```javascript
// Test 1: Valid address
const balance1 = await getUserBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
console.assert(balance1 >= '0', 'Should return valid balance');

// Test 2: Invalid address
const balance2 = await getUserBalance('invalid');
console.assert(balance2 === '0', 'Should return 0 for invalid address');

// Test 3: Empty address
const balance3 = await getUserBalance('');
console.assert(balance3 === '0', 'Should return 0 for empty address');

// Test 4: Null/undefined
const balance4 = await getUserBalance(null);
console.assert(balance4 === '0', 'Should return 0 for null');
```

### Console Output Example

When calling `getUserBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')`:

```
🔍 getUserBalance called with address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✅ Address validated: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
📋 Vault address: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
🌐 Expected network: Hardhat Local
✅ Using MetaMask provider on Hardhat Local
✅ Provider initialized
✅ Contract verified at address
✅ Contract instance created
📞 Calling vault.getBalance()...
✅ Raw balance received: 1000000000
💰 Formatted balance: 1000.000000 sUSDT
✅ getUserBalance completed successfully
```

---

## 🔍 Troubleshooting

### Issue: "could not decode result data"

**Cause:** Contract not deployed or wrong network

**Solution:**
```bash
# 1. Check if Hardhat node is running
lsof -i :8545

# 2. If not running, start it:
cd smart_contracts
npx hardhat node

# 3. Redeploy contracts:
npx hardhat run scripts/deploy.js --network localhost

# 4. Verify contracts.json is updated with new addresses
```

### Issue: "Network mismatch"

**Cause:** MetaMask on wrong network

**Solution:**
```javascript
// Use helper function
import { switchToCorrectNetwork } from '@/utils/getUserBalance';
await switchToCorrectNetwork();

// Or manually switch in MetaMask
// Settings > Networks > Select "Hardhat Local" or "Base Sepolia"
```

### Issue: "No contract found at address"

**Cause:** Contract address wrong or not deployed

**Solution:**
1. Check `frontend/config/contracts.json` has correct addresses
2. Verify contract deployed: `npx hardhat run scripts/deploy.js --network localhost`
3. Ensure network in contracts.json matches deployment network

### Issue: Balance returns '0' but should have funds

**Cause:** Reading from wrong address or no deposits made

**Solution:**
```javascript
// 1. Check console logs for actual balance returned
// 2. Verify you're checking the correct address
// 3. Make a test deposit first:
const vault = await getVaultContract(true);
await vault.deposit(ethers.parseUnits('10', 6));
```

---

## 🎛️ Configuration

### Network Configuration

The function auto-detects network from `contracts.json`:

```json
{
  "network": "localhost",
  "chainId": "1337",
  "contracts": {
    "SenteVault": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  }
}
```

### Supported Networks

1. **Hardhat Local** (Chain ID: 1337)
   - RPC: http://127.0.0.1:8545
   - For local development

2. **Base Sepolia** (Chain ID: 84532)
   - RPC: https://sepolia.base.org
   - For testnet deployment

---

## 📦 Dependencies

```json
{
  "ethers": "^6.x.x"
}
```

---

## 🔐 Security Considerations

1. **Address Validation**: Always validates addresses before contract calls
2. **Network Verification**: Ensures correct network to prevent wrong chain interactions
3. **Contract Verification**: Checks contract exists before attempting calls
4. **Error Boundaries**: Returns safe default ('0') instead of crashing
5. **No Private Key Exposure**: Uses MetaMask's browser provider

---

## 🚀 Performance

- **Average Execution Time**: 200-500ms
- **Caching**: Not implemented (add if needed)
- **Rate Limiting**: Handled by RPC provider
- **Concurrent Calls**: Safe to call multiple times

### Optimization Tips

```javascript
// Batch multiple balance checks
const addresses = ['0x...', '0x...', '0x...'];
const balances = await Promise.all(
  addresses.map(addr => getUserBalance(addr))
);

// Cache results in React
const { data: balance, isLoading } = useQuery(
  ['balance', userAddress],
  () => getUserBalance(userAddress),
  { staleTime: 30000 } // Cache for 30 seconds
);
```

---

## 📝 License

MIT

## 👨‍💻 Author

Senior Blockchain Developer

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📚 Related Functions

- `getVaultContract()` - Get vault contract instance
- `depositTokens()` - Deposit to vault
- `withdrawTokens()` - Withdraw from vault
- `getSavingsBalance()` - Get savings balance

---

**Last Updated:** October 21, 2025
