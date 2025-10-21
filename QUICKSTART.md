# 🚀 SenteChain MiniApp - Quick Start Guide

## ✅ Current Status

**Congratulations! Your SenteChain MiniApp is now running!** 🎉

### 🔧 What's Been Set Up:

✅ **Smart Contracts Compiled & Deployed**
- SenteToken (sUSDT): `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- SenteVault: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- Network: Hardhat Local (Chain ID: 1337)

✅ **Backend Server Running**
- URL: http://localhost:5000
- Health Check: http://localhost:5000/health
- Status: ✅ Active

✅ **Frontend Application Running**
- URL: http://localhost:3000
- Status: ✅ Active
- Environment: Development

---

## 🌐 Access Your Application

### **Open in Browser:**
```
http://localhost:3000
```

### **API Endpoints:**
- Health: `GET http://localhost:5000/health`
- Register: `POST http://localhost:5000/api/auth/register`
- Login: `POST http://localhost:5000/api/auth/login`
- Profile: `GET http://localhost:5000/api/auth/profile`

---

## 🧪 Test the Application

### 1. **Landing Page**
   - Visit http://localhost:3000
   - You should see the SenteChain landing page with login options

### 2. **Login/Register**
   - Enter an email or phone number
   - Click "Continue"
   - The app will create a wallet for you

### 3. **Dashboard**
   - View your sUSDT balance
   - Send tokens to other addresses
   - Access the Savings Vault
   - See transaction history

### 4. **Send Tokens**
   - Enter a recipient address
   - Enter amount
   - Click "Send Now"

### 5. **Savings Vault**
   - Lock tokens for savings
   - View locked balance
   - Withdraw tokens

---

## 🔗 Connect Your Wallet

To interact with the smart contracts, you'll need MetaMask:

### **Add Hardhat Local Network to MetaMask:**

1. Open MetaMask
2. Click "Add Network" (or "Add Custom Network")
3. Enter these details:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. Click "Save"

### **Import Test Account:**

Import this private key to MetaMask (TEST ONLY - DO NOT USE IN PRODUCTION):
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

This account has 10,000 ETH for testing.

---

## 📝 Next Steps

### **For Local Development:**

1. **Keep Hardhat Network Running:**
   ```bash
   # In a new terminal
   cd /home/godwin-ofwono/Desktop/EthNile/SenteChainMiniApp
   npx hardhat node
   ```

2. **Redeploy Contracts (if needed):**
   ```bash
   npm run deploy
   ```

3. **Restart Backend:**
   ```bash
   cd backend
   npm start
   ```

4. **Restart Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### **For Base Sepolia Testnet:**

1. **Get Test ETH:**
   - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or: https://sepolia-faucet.base.org

2. **Update .env with your MetaMask private key:**
   ```bash
   PRIVATE_KEY=your_metamask_private_key_here
   ```

3. **Deploy to Base Sepolia:**
   ```bash
   npm run deploy:base
   ```

4. **Update Frontend Config:**
   - Contract addresses will be saved to `frontend/config/contracts.json`
   - Restart the frontend

---

## 🛠️ Troubleshooting

### **Frontend Not Loading:**
```bash
cd frontend
rm -rf .next
npm run dev
```

### **Backend Connection Error:**
```bash
cd backend
npm start
```

### **Contracts Not Found:**
```bash
npm run compile
npm run deploy
```

### **MetaMask Connection Issues:**
- Make sure you're on the correct network (Hardhat Local or Base Sepolia)
- Clear MetaMask cache: Settings > Advanced > Clear activity and nonce data

---

## 📚 Documentation

- **Main README**: [README.md](./README.md)
- **Development Guide**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **Demo Instructions**: [DEMO.md](./DEMO.md)
- **Build Summary**: [BUILD_SUMMARY.md](./BUILD_SUMMARY.md)

---

## 🎯 Demo Flow for Hackathon

1. **Show Landing Page** → Clean, professional UI
2. **Register User** → Email/phone login simulation
3. **View Dashboard** → Wallet balance, features
4. **Send Transaction** → Demo send to another address
5. **Savings Vault** → Lock/unlock tokens
6. **Show Smart Contracts** → Base Sepolia explorer (if deployed)
7. **Highlight Base Integration** → Transaction hashes, confirmations

---

## 📊 Project Statistics

- **Smart Contracts**: 2 (SenteToken, SenteVault)
- **Frontend Components**: 4 (Navbar, WalletCard, SendForm, SavingsVault)
- **Backend Routes**: 3 (register, login, profile)
- **Pages**: 2 (landing, dashboard)
- **Total Files**: 30+

---

## 🎉 You're All Set!

Your SenteChain MiniApp is ready for:
- ✅ Local development
- ✅ Demo presentations
- ✅ Hackathon pitches
- ✅ Base Sepolia deployment

**Happy Hacking! 🚀**

---

## 📞 Support

If you encounter any issues:
1. Check the terminal outputs for errors
2. Review the documentation files
3. Verify all dependencies are installed
4. Ensure ports 3000 and 5000 are available

**Deployment Date**: October 21, 2025  
**Version**: 1.0.0  
**Status**: ✅ Fully Operational
