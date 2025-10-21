// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SenteToken
 * @dev Mock USDT token for SenteChain MiniApp on Base
 */
contract SenteToken is ERC20, Ownable {
    uint8 private _decimals = 6; // USDT uses 6 decimals
    
    constructor(uint256 initialSupply) ERC20("Sente USD", "sUSDT") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10**_decimals);
    }
    
    /**
     * @dev Returns the number of decimals used for token amounts
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint new tokens (only owner can mint)
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Faucet function for testnet - allows users to claim 100 sUSDT
     * Can be called once per day per address
     */
    mapping(address => uint256) public lastClaimTime;
    uint256 public constant FAUCET_AMOUNT = 100 * 10**6; // 100 sUSDT
    uint256 public constant CLAIM_COOLDOWN = 1 days;
    
    function claimFaucet() external {
        require(
            block.timestamp >= lastClaimTime[msg.sender] + CLAIM_COOLDOWN,
            "Please wait 24 hours between claims"
        );
        
        lastClaimTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }
    
    /**
     * @dev Check if user can claim from faucet
     */
    function canClaimFaucet(address user) external view returns (bool) {
        return block.timestamp >= lastClaimTime[user] + CLAIM_COOLDOWN;
    }
}
