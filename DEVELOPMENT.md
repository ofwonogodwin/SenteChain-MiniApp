# SenteChain Development Guide

## Getting Started

This guide will help you set up and run the SenteChain MiniApp locally.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- MetaMask browser extension
- Git

## Installation

### 1. Quick Setup (Recommended)

Run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all dependencies (root, frontend, backend)
- Create .env file from template
- Set up the project structure

### 2. Manual Setup

If the script doesn't work, install manually:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Create environment file
cp .env.example .env
```

## Configuration

### 1. Get Base Sepolia ETH

You need testnet ETH to deploy contracts and interact with Base Sepolia:

1. Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Enter your wallet address
3. Wait for ETH to arrive

### 2. Configure Environment Variables

Edit `.env` file:

```bash
# Your MetaMask private key (for deployment)
PRIVATE_KEY=your_private_key_here

# Base Sepolia RPC (already set)
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Backend configuration (already set)
PORT=5000
JWT_SECRET=your_jwt_secret

# MongoDB (optional - uses in-memory if not set)
MONGODB_URI=mongodb://localhost:27017/sentechain
```

**⚠️ Important**: Never commit your real private key!

## Development Workflow

### Step 1: Compile Smart Contracts

```bash
npm run compile
```

This compiles the Solidity contracts and generates artifacts.

### Step 2: Deploy Contracts to Base Sepolia

```bash
npm run deploy
```

This will:
- Deploy SenteToken (ERC20)
- Deploy SenteVault
- Save addresses to `frontend/config/contracts.json`

**Expected Output:**
```
🚀 Starting deployment to Base Sepolia...
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.1 ETH
📦 Deploying SenteToken...
✅ SenteToken deployed to: 0x...
📦 Deploying SenteVault...
✅ SenteVault deployed to: 0x...
```

### Step 3: Start Development Servers

#### Option A: Run Both (Frontend + Backend)

```bash
npm run dev
```

This starts both servers concurrently:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Testing the Application

### 1. Register/Login

1. Open http://localhost:3000
2. Enter email: `test@example.com`
3. Click "Continue"
4. You'll be redirected to dashboard with auto-generated wallet

### 2. Connect MetaMask

1. Click "Connect Wallet" button
2. MetaMask will prompt you to connect
3. Approve the connection
4. MetaMask will ask to switch to Base Sepolia (approve)

### 3. Get Test Tokens

1. Click "Claim 100 sUSDT" button
2. Confirm transaction in MetaMask
3. Wait for confirmation
4. Your balance will update

### 4. Deposit to Vault

1. Click "Deposit to Vault"
2. Enter amount (e.g., 50)
3. Approve tokens in MetaMask
4. Confirm deposit transaction
5. Balance will update

### 5. Send Money

1. Go to "Send sUSDT" section
2. Enter recipient address
3. Enter amount
4. Click "Send Now"
5. Confirm in MetaMask

### 6. Lock Savings

1. Go to "Savings Vault" tab
2. Click "Lock Savings"
3. Enter amount
4. Select lock period (e.g., 30 days)
5. Confirm transaction
6. Tokens are now locked!

## Common Issues & Solutions

### Issue: "Cannot connect to MetaMask"

**Solution:** 
- Make sure MetaMask is installed
- Refresh the page
- Check if MetaMask is unlocked

### Issue: "Insufficient funds"

**Solution:**
- Get Base Sepolia ETH from faucet
- Make sure you have enough for gas fees

### Issue: "Contract not deployed"

**Solution:**
- Run `npm run deploy`
- Check `frontend/config/contracts.json` has addresses
- Make sure you're on Base Sepolia network

### Issue: "Backend not responding"

**Solution:**
- Check if backend is running on port 5000
- Check console for errors
- Restart backend server

### Issue: MongoDB connection failed

**Solution:**
- This is OK! App uses in-memory storage as fallback
- To use MongoDB: Install it and update `MONGODB_URI` in .env

## Project Structure Explained

```
sentechain-miniapp/
├── smart_contracts/       # Solidity smart contracts
│   ├── SenteToken.sol    # ERC20 token contract
│   ├── SenteVault.sol    # Vault management contract
│   └── deploy.js         # Deployment script
│
├── frontend/             # Next.js frontend
│   ├── pages/           # Page components
│   ├── components/      # Reusable UI components
│   ├── utils/          # Utility functions (web3, etc)
│   ├── config/         # Contract ABIs and addresses
│   └── styles/         # CSS styles
│
├── backend/             # Express backend
│   ├── routes/         # API routes
│   ├── models/         # Data models
│   └── server.js       # Main server file
│
└── Root files
    ├── hardhat.config.js  # Hardhat configuration
    ├── package.json       # Root dependencies
    └── .env              # Environment variables
```

## Smart Contract Functions

### SenteToken (ERC20)

```solidity
// Get free testnet tokens
function faucet(uint256 amount) external

// Approve vault to spend tokens
function approve(address spender, uint256 amount) external

// Check balance
function balanceOf(address account) external view returns (uint256)
```

### SenteVault

```solidity
// Deposit tokens
function deposit(uint256 amount) external

// Withdraw tokens
function withdraw(uint256 amount) external

// Transfer to another user
function transfer(address to, uint256 amount) external

// Lock tokens for savings
function saveToVault(uint256 amount, uint256 lockDuration) external

// Withdraw from savings (after lock period)
function withdrawFromVault(uint256 amount) external

// View functions
function getBalance(address user) external view returns (uint256)
function getSavingsBalance(address user) external view returns (uint256)
function getUnlockTime(address user) external view returns (uint256)
```

## API Endpoints

### Backend API

**POST /api/auth/login**
- Body: `{ "identifier": "email@example.com" }`
- Returns: User object and JWT token

**GET /api/auth/profile/:walletAddress**
- Returns: User profile

**GET /api/auth/search?query=username**
- Returns: Search results

## Testing with Hardhat

Run contract tests:

```bash
npx hardhat test
```

Deploy to local Hardhat network:

```bash
npx hardhat node
# In another terminal:
npx hardhat run smart_contracts/deploy.js --network localhost
```

## Deployment to Production

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Heroku)

1. Set environment variables
2. Deploy using platform CLI
3. Update frontend with production backend URL

### Smart Contracts (Base Mainnet)

1. Get real ETH on Base mainnet
2. Update `hardhat.config.js` with Base mainnet config
3. Deploy: `npx hardhat run smart_contracts/deploy.js --network base`

## Need Help?

- Check the [README.md](README.md) for more information
- Review the code comments
- Check browser console for errors
- Verify MetaMask is on Base Sepolia network

## Tips for Hackathon Demo

1. **Prepare ahead**: Deploy contracts before demo
2. **Have test accounts**: Create 2-3 test accounts
3. **Show transactions**: Open Base Sepolia explorer in another tab
4. **Explain features**: Walk through each feature clearly
5. **Have backup**: Screenshot key features in case of issues

---

Happy building! 🚀
