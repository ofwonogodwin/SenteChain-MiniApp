#!/bin/bash

# SenteChain MiniApp - Project Verification Script
# Checks if all files and directories are in place

echo "🔍 SenteChain MiniApp - Project Verification"
echo "============================================"
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 ${RED}(MISSING)${NC}"
        ((ERRORS++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗${NC} $1/ ${RED}(MISSING)${NC}"
        ((ERRORS++))
    fi
}

check_optional() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${YELLOW}⚠${NC} $1 ${YELLOW}(optional - will be created)${NC}"
        ((WARNINGS++))
    fi
}

echo "📂 Checking Root Files..."
check_file "package.json"
check_file "hardhat.config.js"
check_file ".env"
check_file ".env.example"
check_file ".gitignore"
check_file "README.md"
check_file "LICENSE"
check_file "setup.sh"
echo ""

echo "📂 Checking Documentation..."
check_file "DEVELOPMENT.md"
check_file "DEMO.md"
check_file "BUILD_SUMMARY.md"
check_file "PROJECT_OVERVIEW.html"
echo ""

echo "📂 Checking Smart Contracts..."
check_dir "smart_contracts"
check_file "smart_contracts/SenteToken.sol"
check_file "smart_contracts/SenteVault.sol"
check_file "smart_contracts/deploy.js"
echo ""

echo "📂 Checking Frontend Structure..."
check_dir "frontend"
check_file "frontend/package.json"
check_file "frontend/next.config.js"
check_file "frontend/tailwind.config.js"
check_file "frontend/postcss.config.js"
echo ""

echo "📂 Checking Frontend Pages..."
check_dir "frontend/pages"
check_file "frontend/pages/_app.jsx"
check_file "frontend/pages/index.jsx"
check_file "frontend/pages/dashboard.jsx"
echo ""

echo "📂 Checking Frontend Components..."
check_dir "frontend/components"
check_file "frontend/components/Navbar.jsx"
check_file "frontend/components/WalletCard.jsx"
check_file "frontend/components/SendForm.jsx"
check_file "frontend/components/SavingsVault.jsx"
echo ""

echo "📂 Checking Frontend Utils..."
check_dir "frontend/utils"
check_file "frontend/utils/contract.js"
check_file "frontend/utils/connectWallet.js"
echo ""

echo "📂 Checking Frontend Config..."
check_dir "frontend/config"
check_file "frontend/config/contracts.json"
check_file "frontend/config/SenteTokenABI.json"
check_file "frontend/config/SenteVaultABI.json"
echo ""

echo "📂 Checking Frontend Styles..."
check_dir "frontend/styles"
check_file "frontend/styles/globals.css"
echo ""

echo "📂 Checking Backend Structure..."
check_dir "backend"
check_file "backend/package.json"
check_file "backend/server.js"
check_file "backend/db.js"
echo ""

echo "📂 Checking Backend Routes..."
check_dir "backend/routes"
check_file "backend/routes/auth.js"
echo ""

echo "📂 Checking Backend Models..."
check_dir "backend/models"
check_file "backend/models/User.js"
echo ""

echo "📂 Checking Optional Directories (created on install)..."
check_optional "frontend/node_modules"
check_optional "backend/node_modules"
check_optional "node_modules"
check_optional "artifacts"
check_optional "cache"
echo ""

# Summary
echo "============================================"
echo "📊 Verification Summary"
echo "============================================"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All required files present!${NC}"
else
    echo -e "${RED}✗ $ERRORS missing file(s) or directory(ies)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS optional file(s) not found (will be created during setup)${NC}"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 Project structure verified successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./setup.sh (to install dependencies)"
    echo "2. Edit .env file with your private key"
    echo "3. Get Base Sepolia ETH from faucet"
    echo "4. Run: npm run compile"
    echo "5. Run: npm run deploy"
    echo "6. Run: npm run dev"
    echo ""
    echo "See README.md for detailed instructions."
    exit 0
else
    echo -e "${RED}⚠️  Some files are missing. Please check the errors above.${NC}"
    exit 1
fi
