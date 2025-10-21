// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SenteVault
 * @dev Manages deposits, withdrawals, transfers, and savings for SenteChain
 */
contract SenteVault is Ownable, ReentrancyGuard {
    IERC20 public senteToken;
    
    // User balances
    mapping(address => uint256) public balances;
    
    // Savings vault - locked balances
    mapping(address => uint256) public savingsBalances;
    mapping(address => uint256) public unlockTime;
    
    // Events
    event Deposited(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event Transferred(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    event SavedToVault(address indexed user, uint256 amount, uint256 unlockTime, uint256 timestamp);
    event WithdrawnFromVault(address indexed user, uint256 amount, uint256 timestamp);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        senteToken = IERC20(_tokenAddress);
    }
    
    /**
     * @dev Deposit tokens into the vault
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(senteToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        balances[msg.sender] += amount;
        emit Deposited(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Withdraw tokens from the vault
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        require(senteToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Transfer tokens to another user within the vault
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function transfer(address to, uint256 amount) external nonReentrant {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        emit Transferred(msg.sender, to, amount, block.timestamp);
    }
    
    /**
     * @dev Lock tokens in savings vault
     * @param amount Amount to lock
     * @param lockDuration Duration in seconds to lock tokens
     */
    function saveToVault(uint256 amount, uint256 lockDuration) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(lockDuration >= 1 days, "Minimum lock period is 1 day");
        require(lockDuration <= 365 days, "Maximum lock period is 365 days");
        
        balances[msg.sender] -= amount;
        savingsBalances[msg.sender] += amount;
        unlockTime[msg.sender] = block.timestamp + lockDuration;
        
        emit SavedToVault(msg.sender, amount, unlockTime[msg.sender], block.timestamp);
    }
    
    /**
     * @dev Withdraw tokens from savings vault (only after unlock time)
     * @param amount Amount to withdraw
     */
    function withdrawFromVault(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(savingsBalances[msg.sender] >= amount, "Insufficient savings balance");
        require(block.timestamp >= unlockTime[msg.sender], "Tokens are still locked");
        
        savingsBalances[msg.sender] -= amount;
        balances[msg.sender] += amount;
        
        emit WithdrawnFromVault(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @dev Get user's available balance
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @dev Get user's savings balance
     */
    function getSavingsBalance(address user) external view returns (uint256) {
        return savingsBalances[user];
    }
    
    /**
     * @dev Get user's unlock time
     */
    function getUnlockTime(address user) external view returns (uint256) {
        return unlockTime[user];
    }
    
    /**
     * @dev Check if savings are unlocked
     */
    function isSavingsUnlocked(address user) external view returns (bool) {
        return block.timestamp >= unlockTime[user];
    }
}
