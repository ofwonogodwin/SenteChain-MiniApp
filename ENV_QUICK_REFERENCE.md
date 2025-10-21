# 🚀 QUICK REFERENCE - Environment Setup

## Current Configuration Status: ✅ READY FOR LOCAL DEVELOPMENT

---

## 📍 CURRENT ADDRESSES (Hardhat Local)

```
Network: Hardhat Local
Chain ID: 1337
RPC: http://127.0.0.1:8545

Smart Contracts:
├─ SenteToken:  0x5FbDB2315678afecb367f032d93F642f64180aa3
└─ SenteVault:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

Deployer Account:
└─ Address:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

## 🔑 CURRENT KEYS (Test Only - PUBLIC)

```bash
# ⚠️ ONLY FOR LOCAL TESTING - DO NOT USE IN PRODUCTION
Test Private Key:
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Test Address:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

JWT Secret (Demo):
demo_jwt_secret_for_local_development_only
```

---

## 📝 CURRENT ENVIRONMENT VARIABLES

### Root `.env`:
```bash
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
BASE_SEPOLIA_RPC=https://sepolia.base.org
PORT=5000
JWT_SECRET=demo_jwt_secret_for_local_development_only
MONGODB_URI=
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

### Frontend `.env.local`:
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

---

## 🎯 WHAT YOU NEED TO ADD

### For Base Sepolia Testnet Deployment:

#### 1. Get Testnet ETH
```
Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

#### 2. Update `.env` file:
```bash
# Replace with your MetaMask private key
PRIVATE_KEY=your_metamask_private_key_here

# Generate secure JWT secret
JWT_SECRET=your_secure_random_secret_here
```

#### 3. Deploy:
```bash
npm run deploy:base
```

#### 4. Addresses will auto-update in:
- `frontend/config/contracts.json`
- `.env` (may need manual copy)

---

## 📊 ALL VARIABLES EXPLAINED

| Variable | Status | Value | Purpose |
|----------|--------|-------|---------|
| **PRIVATE_KEY** | ✅ Set (test) | 0xac09...f80 | Deploy contracts |
| **BASE_SEPOLIA_RPC** | ✅ Set | sepolia.base.org | Base testnet RPC |
| **PORT** | ✅ Set | 5000 | Backend port |
| **JWT_SECRET** | ✅ Set (demo) | demo... | Auth tokens |
| **MONGODB_URI** | ✅ Empty | - | Database (optional) |
| **NEXT_PUBLIC_BACKEND_URL** | ✅ Set | localhost:5000 | Backend API |
| **NEXT_PUBLIC_TOKEN_ADDRESS** | ✅ Set | 0x5FbD...aa3 | Token contract |
| **NEXT_PUBLIC_CONTRACT_ADDRESS** | ✅ Set | 0xe7f1...512 | Vault contract |

---

## 🔄 TO UPDATE FOR PRODUCTION

```bash
# Generate new JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Use your production private key
PRIVATE_KEY=your_production_key

# Production URLs
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
BASE_SEPOLIA_RPC=https://mainnet.base.org
```

---

## 📍 IMPORTANT FILES

```
/home/godwin-ofwono/Desktop/EthNile/SenteChainMiniApp/
├── .env                              ← Main config
├── frontend/.env.local               ← Frontend config
├── frontend/config/contracts.json    ← Contract addresses
└── hardhat.config.js                 ← Blockchain networks
```

---

## ✅ VERIFICATION CHECKLIST

- [x] .env file exists and configured
- [x] Test private key set (Hardhat default)
- [x] Backend port configured (5000)
- [x] JWT secret set (demo)
- [x] Frontend env configured
- [x] Contracts deployed to Hardhat Local
- [x] Contract addresses saved
- [x] Services running:
  - [x] Hardhat node (8545)
  - [x] Backend (5000)
  - [x] Frontend (3000)

---

## 🚨 SECURITY WARNINGS

⚠️ **NEVER commit .env files to Git**
⚠️ **NEVER use test keys in production**
⚠️ **NEVER share your private keys**
⚠️ **ALWAYS generate new JWT secrets for production**

---

## 🔗 QUICK LINKS

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Backend Health**: http://localhost:5000/health
- **Hardhat RPC**: http://127.0.0.1:8545

---

## 📚 DETAILED GUIDES

For complete information, see:
- **ENVIRONMENT_VARIABLES.md** - Full configuration guide
- **METAMASK_SETUP.md** - MetaMask setup
- **README.md** - Project documentation

---

**Status: ✅ Your project is fully configured for local development!**

**Next step**: Follow METAMASK_SETUP.md to connect your wallet and start using the app.
