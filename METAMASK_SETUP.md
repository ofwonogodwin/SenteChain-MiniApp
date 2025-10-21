# 🦊 MetaMask Setup Guide for SenteChain MiniApp

## Quick Setup to Fix the Error

The error you're seeing happens because MetaMask needs to be connected to the **Hardhat Local Network** where your contracts are deployed.

---

## 📋 Step-by-Step Instructions

### **1. Install MetaMask** (if not already installed)
- Download from: https://metamask.io/download/
- Install the browser extension
- Create or import a wallet

### **2. Add Hardhat Local Network to MetaMask**

Click the MetaMask icon in your browser, then:

1. Click the **Network dropdown** (top center)
2. Click "**Add Network**" or "**Add a custom network**"
3. Enter these details:

```
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
Currency Symbol: ETH
```

4. Click **Save**

### **3. Import a Test Account**

Import one of Hardhat's test accounts to get free ETH:

1. In MetaMask, click your account icon (top right)
2. Click "**Import Account**"
3. Select "**Private Key**"
4. Paste this test private key:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

5. Click **Import**

**⚠️ WARNING**: This is a PUBLIC test key. NEVER use it on mainnet or with real funds!

This account will have:
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Balance**: 10,000 ETH (test network only)

### **4. Connect to SenteChain**

1. Go to: **http://localhost:3000/dashboard**
2. Click "**Connect Wallet**" button
3. MetaMask will pop up
4. Click "**Connect**"
5. Approve the connection

### **5. Claim Your Test Tokens**

Once connected:

1. Click "**🚰 Claim 100 sUSDT**" button
2. MetaMask will ask to confirm the transaction
3. Click "**Confirm**"
4. Wait a few seconds for the transaction to complete
5. Your balance will update with 100 sUSDT!

---

## 🎯 What You Can Do Now

### **Send Tokens**
- Scroll to "📤 Send sUSDT" section
- Enter a recipient address (you can use another Hardhat account)
- Enter amount
- Click "💸 Send Now"

### **Lock Savings**
- Scroll to "🏦 Savings Vault" section
- Enter amount to lock
- Choose lock period (7-365 days)
- Click "🔒 Lock in Savings"

### **Withdraw Savings**
- After the lock period expires
- Click "🔓 Withdraw" tab
- Enter amount
- Click "💰 Withdraw from Vault"

---

## 🔧 Troubleshooting

### Error: "could not decode result data"
**Solution**: Make sure you're connected to **Hardhat Local** network (not Ethereum Mainnet or any testnet).

### Error: "Please install MetaMask"
**Solution**: Install MetaMask browser extension from metamask.io

### Error: "User rejected the request"
**Solution**: Click "Confirm" in MetaMask popup to approve the transaction

### Balance not updating
**Solution**: Click the "🔄 Refresh" button in the wallet card

### MetaMask not connecting
**Solution**:
1. Refresh the page
2. Make sure Hardhat node is running (`npx hardhat node`)
3. Make sure you're on Hardhat Local network in MetaMask
4. Try disconnecting and reconnecting

---

## 📊 Additional Test Accounts

You can import more test accounts if needed:

**Account #1**:
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Account #2**:
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

---

## 🚀 Ready to Deploy to Base Sepolia?

When you're ready to move from local testing to the real Base Sepolia testnet:

1. **Get Test ETH**:
   - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or: https://sepolia-faucet.base.org

2. **Add Base Sepolia to MetaMask**:
   ```
   Network Name: Base Sepolia
   RPC URL: https://sepolia.base.org
   Chain ID: 84532
   Currency Symbol: ETH
   Block Explorer: https://sepolia.basescan.org
   ```

3. **Deploy Contracts**:
   ```bash
   npm run deploy:base
   ```

4. **Update Frontend**:
   - Contract addresses will be saved automatically
   - Restart frontend

5. **Connect & Test**:
   - Switch MetaMask to Base Sepolia
   - Connect wallet
   - Start using the app!

---

## 📱 Network Selector

Make sure your MetaMask is always on the correct network:
- **Local Development**: Hardhat Local (Chain ID: 1337)
- **Testnet**: Base Sepolia (Chain ID: 84532)
- **Production**: Base Mainnet (Chain ID: 8453) [when ready]

---

## ✅ Quick Checklist

- [ ] MetaMask installed
- [ ] Hardhat Local network added
- [ ] Test account imported
- [ ] Hardhat node running (`npx hardhat node`)
- [ ] Contracts deployed
- [ ] Frontend running (http://localhost:3000)
- [ ] Wallet connected
- [ ] Tokens claimed

---

## 💡 Pro Tips

1. **Always check your network** before making transactions
2. **Refresh balances** after each transaction
3. **Keep Hardhat node running** in a separate terminal
4. **Check terminal logs** if something goes wrong
5. **Clear MetaMask activity data** if you restart Hardhat node:
   - MetaMask Settings > Advanced > Clear activity and nonce data

---

**Now you're ready to use SenteChain MiniApp!** 🎉

Visit **http://localhost:3000/dashboard** and start exploring!
