# Integration Guide - getUserBalance Function

## 🎯 Quick Start (5 Minutes)

This guide shows you how to integrate the new `getUserBalance` function into your existing SenteChain MiniApp.

---

## 📦 What You Got

Three new files have been created in `frontend/utils/`:

1. **`getUserBalance.js`** - The main function (350+ lines)
2. **`GET_USER_BALANCE_DOCS.md`** - Complete documentation
3. **`testGetUserBalance.js`** - Test suite
4. **`BEFORE_AFTER_COMPARISON.md`** - What changed

---

## 🔧 Integration Steps

### Step 1: Update WalletCard Component

**File:** `frontend/components/WalletCard.jsx`

Replace the import:

```javascript
// OLD
import { getUserBalance } from '../utils/contract';

// NEW
import { getUserBalance } from '../utils/getUserBalance';
```

That's it! The function signature is the same, so no other changes needed.

---

### Step 2: (Optional) Add Network Check

For better UX, add network verification:

```javascript
import { getUserBalance, isOnCorrectNetwork, switchToCorrectNetwork } from '../utils/getUserBalance';

const loadBalances = async () => {
  try {
    setLoading(true);
    
    // Check network first
    const correctNetwork = await isOnCorrectNetwork();
    if (!correctNetwork) {
      toast.error('Wrong network! Switching...');
      try {
        await switchToCorrectNetwork();
      } catch (error) {
        toast.error('Please switch to the correct network in MetaMask');
        return;
      }
    }
    
    // Now fetch balance
    const [bal, savBal, unlock] = await Promise.all([
      getUserBalance(userAddress),
      getSavingsBalance(userAddress),
      getUnlockTime(userAddress),
    ]);

    setBalance(bal);
    setSavingsBalance(savBal);
    setUnlockTime(unlock);
    
  } catch (error) {
    console.error('Error loading balances:', error);
    toast.error('Failed to load balances');
  } finally {
    setLoading(false);
  }
};
```

---

### Step 3: (Optional) Update Dashboard

**File:** `frontend/pages/dashboard.jsx`

Add network status indicator:

```javascript
import { getCurrentNetworkInfo } from '../utils/getUserBalance';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    async function checkNetwork() {
      const info = await getCurrentNetworkInfo();
      setNetworkInfo(info);
    }
    checkNetwork();
  }, []);

  return (
    <div>
      {/* Network Status Badge */}
      {networkInfo && !networkInfo.isCorrectNetwork && (
        <div className="alert alert-warning">
          ⚠️ Wrong Network! Expected: {networkInfo.expectedChainName}, 
          Current: {networkInfo.currentChainName}
        </div>
      )}
      
      {/* Rest of your dashboard */}
    </div>
  );
}
```

---

## 🧪 Testing

### Manual Testing

1. **Start Hardhat node:**
   ```bash
   cd smart_contracts
   npx hardhat node
   ```

2. **Deploy contracts (if needed):**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open browser:**
   - Go to http://localhost:3001
   - Login (test/test123)
   - Connect wallet
   - Check console logs for detailed output

### Expected Console Output

You should see detailed logs like:

```
🔍 getUserBalance called with address: 0xf39...
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

## 🐛 Troubleshooting Integration

### Issue 1: "Module not found"

**Error:**
```
Module not found: Can't resolve '../utils/getUserBalance'
```

**Fix:**
Ensure the file is in the correct location:
```
frontend/utils/getUserBalance.js
```

---

### Issue 2: "Default export not found"

**Error:**
```
getUserBalance is not a function
```

**Fix:**
Use named import:
```javascript
// ✅ CORRECT
import { getUserBalance } from '../utils/getUserBalance';

// ❌ WRONG
import getUserBalance from '../utils/getUserBalance';
```

---

### Issue 3: Still getting "could not decode result data"

**Possible Causes:**

1. **Hardhat node not running**
   ```bash
   # Check if running
   lsof -i :8545
   
   # Start if not running
   cd smart_contracts && npx hardhat node
   ```

2. **Contracts not deployed**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Wrong network in MetaMask**
   - Open MetaMask
   - Switch to "Hardhat Local" (Chain ID 1337)
   - Or click "Connect Wallet" to auto-switch

4. **Stale contracts.json**
   - After redeploying, check `frontend/config/contracts.json` has new addresses
   - Restart frontend: `npm run dev`

---

## 📊 Verification Checklist

Before considering integration complete:

- [ ] Import updated in WalletCard.jsx
- [ ] Frontend builds without errors (`npm run dev`)
- [ ] Can see detailed console logs when loading balance
- [ ] Balance displays correctly in UI
- [ ] Wrong network shows helpful error message
- [ ] Can switch networks using helper function
- [ ] No TypeScript errors (if using TypeScript)

---

## 🎨 UI Enhancements (Optional)

### Add Network Badge

```jsx
// components/NetworkBadge.jsx
import { useState, useEffect } from 'react';
import { getCurrentNetworkInfo } from '../utils/getUserBalance';

export default function NetworkBadge() {
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    async function load() {
      const info = await getCurrentNetworkInfo();
      setNetworkInfo(info);
    }
    load();
    
    // Refresh every 5 seconds
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!networkInfo?.connected) return null;

  return (
    <div className={`badge ${networkInfo.isCorrectNetwork ? 'badge-success' : 'badge-warning'}`}>
      {networkInfo.isCorrectNetwork ? '✅' : '⚠️'} {networkInfo.currentChainName}
    </div>
  );
}
```

### Add in Navbar

```jsx
// components/Navbar.jsx
import NetworkBadge from './NetworkBadge';

export default function Navbar() {
  return (
    <nav>
      {/* ... existing navbar content ... */}
      <NetworkBadge />
    </nav>
  );
}
```

---

## 🚀 Advanced Usage

### Caching with React Query

```bash
npm install @tanstack/react-query
```

```javascript
// hooks/useUserBalance.js
import { useQuery } from '@tanstack/react-query';
import { getUserBalance } from '../utils/getUserBalance';

export function useUserBalance(address) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: () => getUserBalance(address),
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
}

// In component:
const { data: balance, isLoading, error } = useUserBalance(userAddress);
```

---

## 📝 Code Cleanup (Optional)

After verifying the new function works, you can:

1. **Remove old getUserBalance from contract.js**
   - Keep other functions (deposit, withdraw, etc.)
   - Only remove the getUserBalance implementation

2. **Update all imports across your codebase**
   ```bash
   # Search for old imports
   grep -r "getUserBalance" frontend/
   
   # Update each file to use new import
   ```

---

## 🎓 Best Practices

1. **Always check network before critical operations:**
   ```javascript
   if (!await isOnCorrectNetwork()) {
     await switchToCorrectNetwork();
   }
   ```

2. **Use try-catch for user-facing errors:**
   ```javascript
   try {
     const balance = await getUserBalance(address);
   } catch (error) {
     toast.error('Failed to load balance. Please check your connection.');
   }
   ```

3. **Add loading states:**
   ```javascript
   setLoading(true);
   const balance = await getUserBalance(address);
   setLoading(false);
   ```

4. **Log errors in production:**
   ```javascript
   if (balance === '0') {
     console.warn('Balance is 0 - check if user has deposited funds');
   }
   ```

---

## 📞 Need Help?

1. **Check console logs** - The function provides detailed output
2. **Read the docs** - `GET_USER_BALANCE_DOCS.md` has everything
3. **Run tests** - Execute `testGetUserBalance.js`
4. **Compare old vs new** - See `BEFORE_AFTER_COMPARISON.md`

---

## ✅ Success!

If you can:
- ✅ See detailed console logs
- ✅ Load balances without errors
- ✅ Get helpful error messages when something's wrong

**Then integration is complete!** 🎉

---

**Estimated Integration Time:** 5-15 minutes  
**Difficulty:** Easy  
**Risk:** Low (function signature unchanged)

**Last Updated:** October 21, 2025
