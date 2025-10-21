# 🎯 SenteChain - Hackathon Demo Script

## Pre-Demo Checklist ✅

### Before the Presentation

- [ ] Contracts deployed to Base Sepolia
- [ ] Frontend and backend running
- [ ] Test accounts created and funded
- [ ] MetaMask configured with Base Sepolia
- [ ] Browser tabs organized:
  - Tab 1: Frontend (http://localhost:3000)
  - Tab 2: Base Sepolia Explorer
  - Tab 3: Presentation slides (if any)

### Test Accounts

Create 3 test accounts for demo:
1. **Alice**: alice@sentechain.com
2. **Bob**: bob@sentechain.com
3. **Carol**: carol@sentechain.com

## 🎬 Demo Flow (5 Minutes)

### Act 1: Introduction (30 seconds)

**Script:**
> "Hi! I'm presenting SenteChain - a Web3 app that makes sending money as easy as sending a text message. Built on Base, Coinbase's Layer 2, it's designed for everyday Ugandans who want to send, receive, and save USDT without needing any crypto knowledge."

**Show:** Landing page with clean UI

---

### Act 2: Walletless Onboarding (45 seconds)

**Script:**
> "First, let's see how easy it is to get started. No private keys, no seed phrases - just your email or phone number."

**Actions:**
1. Type: `alice@sentechain.com`
2. Click "Continue"
3. **Point out:** "Wallet created automatically!"

**Show:** Dashboard with wallet address

---

### Act 3: Connect to Base (30 seconds)

**Script:**
> "Under the hood, we're connected to Base Sepolia. Each user gets a real blockchain wallet. Let me connect MetaMask to show you."

**Actions:**
1. Click "Connect Wallet"
2. Approve in MetaMask
3. Switch to Base Sepolia

**Show:** Green "Connected" status

---

### Act 4: Get Test Funds (45 seconds)

**Script:**
> "For demo purposes, I'll use our testnet faucet to get some sUSDT - our mock USDT token."

**Actions:**
1. Click "Claim 100 sUSDT"
2. Confirm in MetaMask
3. Wait for transaction

**Show:** 
- Transaction hash
- Balance updates to 100 sUSDT
- Open explorer link in new tab

**Script:**
> "And there it is - confirmed on Base Sepolia. You can see the transaction right here on the blockchain explorer."

---

### Act 5: Instant Transfer (1 minute)

**Script:**
> "Now let's send money to another user. This is where it gets interesting - transfers between SenteChain users are instant and have ZERO fees."

**Actions:**
1. In Send Form:
   - Enter Bob's wallet address (have it ready)
   - Enter amount: 25
2. Click "Send Now"
3. Confirm transaction

**Show:**
- Transaction confirmation
- Balance updates: 100 → 75
- Transaction link on explorer

**Script:**
> "Bob just received 25 sUSDT instantly. No waiting, no fees. This is the power of Layer 2 combined with our vault system."

---

### Act 6: Savings Vault (1 minute)

**Script:**
> "Finally, let's talk about savings. In Uganda, many people struggle to save money. Our Savings Vault helps with that by allowing users to lock their funds for a specific period."

**Actions:**
1. Click "Savings Vault" tab
2. Select "Lock Savings"
3. Enter amount: 30
4. Select period: 30 days
5. Click "Lock in Savings"
6. Confirm transaction

**Show:**
- Available balance: 75 → 45
- Savings balance: 0 → 30
- Unlock date displayed

**Script:**
> "These 30 sUSDT are now locked for 30 days. I can't touch them until the unlock date - helping me save for future goals. Think of it as a digital piggy bank that you can't break!"

---

### Act 7: The Big Picture (30 seconds)

**Script:**
> "So to recap - SenteChain makes crypto accessible by removing the complexity. No seed phrases to remember, instant transfers, and built-in savings tools. All running on Base, which means low fees and high speed."

**Show:** Dashboard overview

---

### Act 8: Q&A Prep (remaining time)

**Be Ready For These Questions:**

**Q: "How do you handle private keys?"**
> A: We use deterministic wallet generation based on email/phone. In production, we'd integrate account abstraction solutions like Privy or Web3Auth for secure key management.

**Q: "What about gas fees?"**
> A: Transfers within our vault don't require gas because they're internal state changes. Only deposits and withdrawals interact with the blockchain. On Base, these fees are minimal - usually under $0.01.

**Q: "Why Base?"**
> A: Three reasons: 1) Low fees, 2) Coinbase backing means credibility, 3) Growing ecosystem. Base is perfect for African markets.

**Q: "What's your business model?"**
> A: Potential revenue streams: 1) Small fee on external deposits, 2) Interest on locked savings, 3) Premium features, 4) B2B solutions for merchants.

**Q: "How do you handle regulations?"**
> A: We'd work with local regulators, implement KYC for larger transactions, and partner with licensed money transmitters. The tech is ready - we just need the right partnerships.

**Q: "What about offline users?"**
> A: That's Phase 2! We're exploring USSD integration and SMS-based transactions for users without smartphones or internet.

---

## 🎨 Visual Tips

### What to Highlight

- ✅ **Clean UI**: Point out how simple and intuitive it is
- ✅ **Transaction Speed**: Emphasize instant confirmations
- ✅ **Zero Fees**: Mention multiple times
- ✅ **Blockchain Explorer**: Show real on-chain transactions
- ✅ **Mobile-First**: Mention responsive design

### What to Downplay

- ⚠️ Testnet disclaimer (mention briefly, don't dwell)
- ⚠️ MetaMask complexity (this is for demo only)
- ⚠️ Technical implementation details (unless asked)

---

## 🚨 Backup Plans

### If Demo Fails

**Option 1: Screen Recording**
- Have a pre-recorded demo video ready
- Play it while you narrate live

**Option 2: Screenshots**
- Prepare screenshots of each step
- Walk through them as slides

**Option 3: Deployed Version**
- Have a public deployment URL ready
- Can demo from phone if needed

### If Questions Get Technical

- Keep it simple and relatable
- Use analogies: "Think of it like M-Pesa but global"
- Redirect to business value: "The key is making this easy for users"

---

## 📊 Key Metrics to Mention

- **Transaction Time**: ~2-3 seconds on Base Sepolia
- **Gas Fees**: <$0.01 per transaction on Base
- **User Onboarding**: <30 seconds from email to wallet
- **Target Market**: 45M+ Ugandans sending remittances

---

## 🎯 Closing Statement

**Script:**
> "SenteChain is more than just a wallet - it's a bridge between traditional finance and Web3. We're making blockchain technology accessible to millions of people who need it most. With Base's infrastructure and our user-first design, we're ready to revolutionize how Africans send, receive, and save money. Thank you!"

---

## 🎬 Post-Demo

### Follow-Up Materials

Have ready to share:
- GitHub repository link
- Live demo URL (if deployed)
- Presentation deck
- Contact information
- Whitepaper/roadmap

### Quick Setup for Judges

If judges want to try it themselves:

```bash
git clone <repo-url>
cd sentechain-miniapp
./setup.sh
npm run compile
npm run deploy
npm run dev
```

Then open http://localhost:3000

---

## 💪 Confidence Boosters

Remember:
- ✅ You built a FULL Web3 app
- ✅ It's deployed on a real blockchain
- ✅ The code works and is well-structured
- ✅ You're solving a REAL problem
- ✅ The UI looks professional

You've got this! 🚀

---

## 🎭 Pro Tips

1. **Smile and Be Enthusiastic**: Your energy matters!
2. **Speak Slowly**: Judges need time to process
3. **Make Eye Contact**: Connect with your audience
4. **Handle Errors Gracefully**: If something breaks, keep calm
5. **Tell a Story**: Make it personal and relatable
6. **End Strong**: Finish with your best point

---

**Good luck with your demo! You're going to crush it! 💚**
