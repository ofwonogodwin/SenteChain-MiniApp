# 🔐 ENVIRONMENT VARIABLES & CONFIGURATION GUIDE

## 📋 Complete Review of SenteChain MiniApp Configuration

This guide lists **ALL** environment variables, addresses, and keys needed for your project.

---

## 🎯 Current Configuration Status

### ✅ **What's Already Configured (Local Development)**

Your project is currently configured for **local Hardhat development** with these values:

```bash
# Root .env file
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
BASE_SEPOLIA_RPC=https://sepolia.base.org
PORT=5000
JWT_SECRET=demo_jwt_secret_for_local_development_only
MONGODB_URI=
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

```bash
# Frontend .env.local file
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**Contract Addresses (Hardhat Local):**
- **SenteToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **SenteVault**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Chain ID**: `1337` (Hardhat Local)
- **Deployer**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

---

## 📝 ALL Environment Variables Explained

### **1. BLOCKCHAIN CONFIGURATION**

#### `PRIVATE_KEY` (Required for deployment)
- **Current Value (Local)**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Purpose**: Deploy contracts to blockchain
- **Used In**: `hardhat.config.js`
- **⚠️ Security**: 
  - Current key is Hardhat's first test account (PUBLIC - never use in production!)
  - Has 10,000 ETH on Hardhat local network
  - **For Base Sepolia**: Get your own from MetaMask (Account Details > Export Private Key)

**How to get your own:**
1. Open MetaMask
2. Click your account icon
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter password
6. Copy the key (starts with `0x`)

#### `BASE_SEPOLIA_RPC` (Required for Base deployment)
- **Current Value**: `https://sepolia.base.org`
- **Purpose**: RPC endpoint for Base Sepolia testnet
- **Used In**: `hardhat.config.js`
- **Alternatives**:
  - Public RPC: `https://sepolia.base.org`
  - Alchemy: `https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
  - Infura: `https://base-sepolia.infura.io/v3/YOUR_PROJECT_ID`

---

### **2. BACKEND CONFIGURATION**

#### `PORT` (Optional)
- **Current Value**: `5000`
- **Default**: `5000`
- **Purpose**: Backend server port
- **Used In**: `backend/server.js`

#### `JWT_SECRET` (Required for authentication)
- **Current Value**: `demo_jwt_secret_for_local_development_only`
- **Purpose**: Sign JWT tokens for user authentication
- **Used In**: `backend/routes/auth.js`
- **⚠️ Security**: Change this for production!
- **How to generate secure secret**:
  ```bash
  # Generate random secret
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### `MONGODB_URI` (Optional)
- **Current Value**: Empty (using in-memory storage)
- **Default**: `mongodb://localhost:27017/sentechain`
- **Purpose**: Database connection string
- **Used In**: `backend/db.js`
- **When to use**: 
  - Local MongoDB: `mongodb://localhost:27017/sentechain`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/sentechain`
  - Leave empty for in-memory storage (development only)

---

### **3. FRONTEND CONFIGURATION**

#### `NEXT_PUBLIC_BACKEND_URL` (Required)
- **Current Value**: `http://localhost:5000`
- **Purpose**: Backend API endpoint
- **Used In**: `frontend/next.config.js`, `frontend/pages/index.jsx`
- **Production Value**: `https://your-backend-domain.com`

#### `NEXT_PUBLIC_TOKEN_ADDRESS` (Required after deployment)
- **Current Value (Local)**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Purpose**: SenteToken (ERC20) contract address
- **Used In**: `frontend/next.config.js`
- **Auto-filled**: After deployment via `frontend/config/contracts.json`

#### `NEXT_PUBLIC_CONTRACT_ADDRESS` (Required after deployment)
- **Current Value (Local)**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Purpose**: SenteVault contract address
- **Used In**: `frontend/next.config.js`
- **Auto-filled**: After deployment via `frontend/config/contracts.json`

---

## 🌐 Configuration by Environment

### **LOCAL DEVELOPMENT** (Current Setup) ✅

**Root `.env` file:**
```bash
# Hardhat test account (PUBLIC KEY - DO NOT USE IN PRODUCTION)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Base RPC (not used for local, but required in config)
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Backend
PORT=5000
JWT_SECRET=demo_jwt_secret_for_local_development_only
MONGODB_URI=

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**Frontend `.env.local` file:**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

**Test Account:**
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Balance: 10,000 ETH (local only)

---

### **BASE SEPOLIA TESTNET** (What You Need to Add)

**Root `.env` file:**
```bash
# YOUR MetaMask private key (keep this SECRET!)
PRIVATE_KEY=your_metamask_private_key_from_export

# Base Sepolia RPC
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Backend
PORT=5000
JWT_SECRET=your_secure_random_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/sentechain  # or leave empty

# Frontend (will be auto-filled after deployment)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=  # Filled after deployment
NEXT_PUBLIC_CONTRACT_ADDRESS=  # Filled after deployment
```

**Steps to deploy to Base Sepolia:**

1. **Get Base Sepolia ETH** (for gas fees):
   - Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or: https://sepolia-faucet.base.org
   - Connect your MetaMask wallet
   - Request testnet ETH

2. **Update your private key**:
   ```bash
   # Edit .env file
   PRIVATE_KEY=0x... # Your real MetaMask private key
   ```

3. **Deploy contracts**:
   ```bash
   npm run deploy:base
   ```

4. **Contract addresses will be saved automatically** to:
   - `frontend/config/contracts.json`
   - `.env` file (you may need to copy them manually)

5. **Restart frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

---

### **PRODUCTION** (Base Mainnet - Future)

**Root `.env` file:**
```bash
# Production private key (KEEP SECRET - use hardware wallet!)
PRIVATE_KEY=your_production_private_key

# Base Mainnet RPC
BASE_SEPOLIA_RPC=https://mainnet.base.org

# Backend
PORT=5000
JWT_SECRET=super_secure_random_generated_secret_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sentechain

# Frontend
NEXT_PUBLIC_BACKEND_URL=https://api.sentechain.com
NEXT_PUBLIC_TOKEN_ADDRESS=deployed_mainnet_token_address
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_mainnet_vault_address
```

---

## 🔑 Additional Test Accounts (Hardhat Local)

If you need more test accounts for local development:

**Account #1:**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Account #2:**
- Address: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`

**Account #3:**
- Address: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- Private Key: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`

---

## 📂 Where Configuration is Used

### **Root `.env`** (Main configuration)
- Read by: `hardhat.config.js`, `backend/server.js`
- Controls: Contract deployment, backend server

### **`frontend/.env.local`** (Frontend configuration)
- Read by: Next.js build process
- Controls: Frontend API calls, contract interactions

### **`frontend/config/contracts.json`** (Auto-generated)
- Created by: `smart_contracts/deploy.js`
- Contains: Deployed contract addresses, network info
- Used by: `frontend/utils/contract.js`

---

## ✅ Configuration Checklist

### **For Local Development (Already Done)** ✅
- [x] `.env` file created
- [x] Test private key configured
- [x] Backend port set
- [x] JWT secret set (demo)
- [x] Contracts deployed
- [x] Contract addresses in `.env`
- [x] Frontend `.env.local` created
- [x] All services running

### **For Base Sepolia Deployment (To Do)**
- [ ] Get Base Sepolia ETH from faucet
- [ ] Export your MetaMask private key
- [ ] Update `PRIVATE_KEY` in `.env`
- [ ] Generate secure JWT secret
- [ ] Run `npm run deploy:base`
- [ ] Verify contracts on Base Explorer
- [ ] Update frontend with new addresses
- [ ] Test all features on testnet

### **For Production (Future)**
- [ ] Get Base Mainnet ETH
- [ ] Use hardware wallet for deployment
- [ ] Set up MongoDB Atlas
- [ ] Configure custom RPC provider
- [ ] Deploy to Base Mainnet
- [ ] Set up domain and HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and alerts

---

## 🔒 Security Best Practices

### **DO:**
✅ Keep `.env` files in `.gitignore`  
✅ Use different keys for different environments  
✅ Generate strong random JWT secrets  
✅ Use environment variables for sensitive data  
✅ Rotate keys regularly in production  
✅ Use hardware wallets for mainnet deployments  

### **DON'T:**
❌ Commit `.env` files to Git  
❌ Share private keys  
❌ Use test keys in production  
❌ Hardcode secrets in code  
❌ Reuse the Hardhat test key for anything real  
❌ Store private keys in plain text  

---

## 🛠️ Useful Commands

### **Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **View Current Configuration:**
```bash
cat .env
```

### **Deploy to Base Sepolia:**
```bash
npm run deploy:base
```

### **Check Contract Addresses:**
```bash
cat frontend/config/contracts.json
```

### **Test Backend Connection:**
```bash
curl http://localhost:5000/health
```

---

## 📊 Summary Table

| Variable | Required? | Current Value | Where Used | Notes |
|----------|-----------|---------------|------------|-------|
| `PRIVATE_KEY` | Yes (deploy) | Hardhat test key | hardhat.config.js | ⚠️ Change for Base Sepolia |
| `BASE_SEPOLIA_RPC` | Yes (Base) | https://sepolia.base.org | hardhat.config.js | Public RPC endpoint |
| `PORT` | Optional | 5000 | backend/server.js | Backend server port |
| `JWT_SECRET` | Yes (auth) | Demo secret | backend/routes/auth.js | ⚠️ Change for production |
| `MONGODB_URI` | Optional | Empty | backend/db.js | Leave empty for dev |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | http://localhost:5000 | Frontend | Backend API URL |
| `NEXT_PUBLIC_TOKEN_ADDRESS` | Yes | 0x5FbD...80aa3 | Frontend | SenteToken address |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Yes | 0xe7f1...F0512 | Frontend | SenteVault address |

---

## 🎯 What You Need to Do NOW

### **For Continued Local Development:**
✅ **Nothing!** Your configuration is complete and working.

### **To Deploy to Base Sepolia Testnet:**

1. **Get testnet ETH**:
   ```
   Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   ```

2. **Update your `.env` file**:
   ```bash
   PRIVATE_KEY=your_real_metamask_private_key_here
   JWT_SECRET=your_generated_secure_secret_here
   ```

3. **Deploy**:
   ```bash
   npm run deploy:base
   ```

4. **Contract addresses will be automatically saved!**

---

## 📞 Need Help?

- **Local development issues**: Check if Hardhat node is running
- **Deployment issues**: Verify you have testnet ETH
- **Frontend issues**: Check browser console for errors
- **Backend issues**: Check terminal logs

---

**Your project is properly configured for local development! 🎉**

To deploy to Base Sepolia, just follow the steps above!
