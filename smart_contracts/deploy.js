const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment to Base Sepolia...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy SenteToken
  console.log("📦 Deploying SenteToken...");
  const SenteToken = await hre.ethers.getContractFactory("SenteToken");
  const initialSupply = 1000000; // 1 million tokens
  const senteToken = await SenteToken.deploy(initialSupply);
  await senteToken.waitForDeployment();
  const tokenAddress = await senteToken.getAddress();
  console.log("✅ SenteToken deployed to:", tokenAddress);

  // Deploy SenteVault
  console.log("\n📦 Deploying SenteVault...");
  const SenteVault = await hre.ethers.getContractFactory("SenteVault");
  const senteVault = await SenteVault.deploy(tokenAddress);
  await senteVault.waitForDeployment();
  const vaultAddress = await senteVault.getAddress();
  console.log("✅ SenteVault deployed to:", vaultAddress);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      SenteToken: tokenAddress,
      SenteVault: vaultAddress
    },
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  // Save to frontend config
  const configPath = path.join(__dirname, "../frontend/config/contracts.json");
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📄 Deployment info saved to frontend/config/contracts.json");
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   Network:", hre.network.name);
  console.log("   Chain ID:", deploymentInfo.chainId);
  console.log("   SenteToken:", tokenAddress);
  console.log("   SenteVault:", vaultAddress);
  console.log("\n💡 Next steps:");
  console.log("   1. Update .env file with contract addresses");
  console.log("   2. Verify contracts on Base Sepolia explorer");
  console.log("   3. Start the frontend application");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
