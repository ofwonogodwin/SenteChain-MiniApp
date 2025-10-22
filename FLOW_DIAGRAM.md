# getUserBalance - Flow Diagram

## 🔄 Function Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    getUserBalance(address)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: VALIDATE INPUT ADDRESS                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Check if address exists                                 │  │
│  │ • Check if address is string                              │  │
│  │ • Validate with ethers.isAddress()                        │  │
│  │ • Normalize to checksum format                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Valid ✅                │ Invalid ❌                   │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Return '0', Log error
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: VERIFY CONFIGURATION                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Check contracts.json exists                             │  │
│  │ • Verify SenteVault address present                       │  │
│  │ • Get expected network from chainId                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Valid ✅                │ Missing ❌                   │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Throw: "Contract address not found"
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: GET PROVIDER                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Try: window.ethereum (MetaMask)                           │  │
│  │   ├─ Success → BrowserProvider                            │  │
│  │   └─ Fail → JsonRpcProvider (Fallback)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Connected ✅            │ Failed ❌                    │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Throw: "Provider error"
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: VERIFY NETWORK                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Get current chain ID from provider                      │  │
│  │ • Compare with expected chain ID                          │  │
│  │ • Ensure they match                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Match ✅                │ Mismatch ❌                  │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Throw: "Network mismatch: Expected X, got Y"
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: VERIFY CONTRACT EXISTS                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ • Call provider.getCode(vaultAddress)                     │  │
│  │ • Check if bytecode exists                                │  │
│  │ • Verify not '0x' or '0x0'                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Exists ✅               │ Not Found ❌                 │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Throw: "No contract found at address"
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 6: CREATE CONTRACT INSTANCE                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ new ethers.Contract(                                      │  │
│  │   vaultAddress,                                           │  │
│  │   SenteVaultABI,                                          │  │
│  │   provider                                                │  │
│  │ )                                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Created ✅              │ Failed ❌                    │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Throw: "Contract creation failed"
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 7: CALL CONTRACT METHOD                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ vault.getBalance(checksumAddress)                         │  │
│  │   ↓                                                       │  │
│  │ Returns: BigNumber (e.g., 1000000000)                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│         │ Success ✅              │ Failed ❌                    │
└─────────┼─────────────────────────┼───────────────────────────────┘
          │                         │
          │                         └─→ Enhanced error with context
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 8: FORMAT BALANCE                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ethers.formatUnits(rawBalance, 6)                         │  │
│  │   ↓                                                       │  │
│  │ "1000.000000" (string with 6 decimals)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RETURN FORMATTED BALANCE                    │
│                        "1000.000000"                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ANY ERROR OCCURS                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Catch Block: Comprehensive Error Handler                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. Log full error context:                                │  │
│  │    - Error message                                        │  │
│  │    - Input address                                        │  │
│  │    - Vault address                                        │  │
│  │    - Network/Chain ID                                     │  │
│  │    - Stack trace                                          │  │
│  │                                                           │  │
│  │ 2. Check error type:                                      │  │
│  │    ├─ "could not decode" → Detailed BAD_DATA explanation │  │
│  │    ├─ "network" → Network troubleshooting                │  │
│  │    ├─ "invalid address" → Address format help            │  │
│  │    └─ Other → Generic error with context                 │  │
│  │                                                           │  │
│  │ 3. Return safe default: '0'                               │  │
│  │    (Alternative: throw error for component handling)     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RETURN '0' TO CALLER                       │
│                (UI remains stable, error logged)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Network Detection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              Read contracts.json → chainId                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────┴─────────┐
                    │   chainId = ?     │
                    └─────────┬─────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐        ┌──────────┐       ┌──────────┐
    │   1337   │        │  84532   │       │  Other   │
    └──────────┘        └──────────┘       └──────────┘
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌──────────┐
│ Hardhat Local   │  │  Base Sepolia   │  │  Error   │
│ Chain ID: 1337  │  │ Chain ID: 84532 │  │Unsupported│
│ RPC: :8545      │  │ RPC: sepolia... │  └──────────┘
└─────────────────┘  └─────────────────┘
```

---

## 🔌 Provider Selection Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   Need to get provider?                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ window.ethereum │
                    │    exists?      │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                   YES               NO
                    │                 │
                    ▼                 ▼
         ┌────────────────────┐  ┌────────────────────┐
         │  BrowserProvider   │  │  JsonRpcProvider   │
         │   (MetaMask)       │  │   (Direct RPC)     │
         └────────┬───────────┘  └────────┬───────────┘
                  │                       │
                  ▼                       ▼
         ┌────────────────────┐  ┌────────────────────┐
         │ Verify network     │  │ Connect to RPC     │
         │ matches expected   │  │ (fallback)         │
         └────────┬───────────┘  └────────┬───────────┘
                  │                       │
        ┌─────────┴────────┐              │
        │                  │              │
    Match ✅          Mismatch ❌          │
        │                  │              │
        ▼                  ▼              │
   Use MetaMask      Log warning         │
                     Try RPC fallback ────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Return Provider│
                      └───────────────┘
```

---

## 🎯 Success Path (Happy Flow)

```
getUserBalance('0xf39Fd6...')
     │
     ├─→ ✅ Address valid
     ├─→ ✅ Config exists
     ├─→ ✅ Provider connected
     ├─→ ✅ Network matches (1337)
     ├─→ ✅ Contract exists
     ├─→ ✅ Contract created
     ├─→ ✅ getBalance() called
     ├─→ ✅ Returns: 1000000000
     ├─→ ✅ Formatted: "1000.000000"
     └─→ ✅ Success!

Console Output:
🔍 getUserBalance called with address: 0xf39Fd6...
✅ Address validated
📋 Vault address: 0xCf7Ed3...
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

## ❌ Error Paths

### Path 1: Invalid Address
```
getUserBalance('invalid')
     │
     └─→ ❌ Address validation fails
          └─→ Log: "Invalid Ethereum address format"
               └─→ Return: "0"
```

### Path 2: Wrong Network
```
getUserBalance('0xf39...')
     │
     ├─→ ✅ Address valid
     ├─→ ✅ Config exists
     ├─→ ✅ Provider connected
     └─→ ❌ Network mismatch (Expected: 1337, Got: 84532)
          └─→ Throw: "Network mismatch: Contract deployed on Hardhat Local (1337), but MetaMask is on chain 84532"
```

### Path 3: Contract Not Found
```
getUserBalance('0xf39...')
     │
     ├─→ ✅ Address valid
     ├─→ ✅ Config exists
     ├─→ ✅ Provider connected
     ├─→ ✅ Network matches
     └─→ ❌ getCode() returns '0x'
          └─→ Throw: "No contract found at address 0x..."
               └─→ Suggests: Check deployment, network, etc.
```

### Path 4: Contract Call Fails
```
getUserBalance('0xf39...')
     │
     ├─→ ✅ All checks pass
     └─→ ❌ vault.getBalance() throws
          └─→ Check error type
               ├─→ "decode" → BAD_DATA explanation
               ├─→ "network" → Connection help
               └─→ Other → Generic error + context
                    └─→ Return: "0"
```

---

## 🔄 Helper Functions Flow

### isOnCorrectNetwork()
```
┌────────────────┐
│ Get MetaMask   │
│ chain ID       │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Get expected   │
│ chain ID from  │
│ contracts.json │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Compare        │
│ IDs            │
└───────┬────────┘
        │
   ┌────┴────┐
   │         │
 Match    Mismatch
   │         │
   ▼         ▼
 true      false
```

### switchToCorrectNetwork()
```
┌─────────────────────┐
│ Get expected network│
│ config              │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Request MetaMask    │
│ switch to chain     │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
   Success   Error 4902
      │      (Not added)
      │         │
      │         ▼
      │    ┌─────────────┐
      │    │ Request add │
      │    │ network     │
      │    └──────┬──────┘
      │           │
      └───────────┴────→ Done
```

---

## 📊 Data Flow

```
User Address (string)
    ↓
getUserBalance()
    ↓
[Validation & Verification]
    ↓
Provider
    ↓
Contract Instance
    ↓
vault.getBalance(address)
    ↓
BigNumber (raw: 1000000000)
    ↓
ethers.formatUnits(balance, 6)
    ↓
Formatted String ("1000.000000")
    ↓
Return to Caller
    ↓
Display in UI
```

---

## 🎨 Visual Legend

```
✅ Success checkpoint
❌ Error/failure point
│  Sequential flow
├─ Branch point
└─ Terminal point
↓  Data flow
→  Alternate path
```

---

**Use this diagram to understand:**
- Where errors can occur
- How validation works
- Why each step is necessary
- How to debug issues

**Last Updated:** October 21, 2025
