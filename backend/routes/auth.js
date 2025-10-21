const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ethers } = require('ethers');

// In-memory storage fallback (if MongoDB is not available)
const inMemoryUsers = new Map();

// Generate a deterministic wallet address from email/phone
const generateWalletAddress = (identifier) => {
  // Create a deterministic wallet from identifier
  const hash = ethers.keccak256(ethers.toUtf8Bytes(identifier));
  const privateKey = hash;
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
};

// Generate JWT token
const generateToken = (userId, walletAddress) => {
  return jwt.sign(
    { userId, walletAddress },
    process.env.JWT_SECRET || 'sentechain_secret_key_2024',
    { expiresIn: '30d' }
  );
};

// Register/Login endpoint
router.post(
  '/login',
  [
    body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { identifier } = req.body;

      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const searchQuery = isEmail ? { email: identifier } : { phone: identifier };

      // Generate wallet address
      const walletAddress = generateWalletAddress(identifier);

      // Generate username from identifier
      const username = isEmail
        ? identifier.split('@')[0]
        : `user_${identifier.slice(-4)}`;

      let user;
      let isNewUser = false;

      try {
        // Try to find existing user in MongoDB
        user = await User.findOne(searchQuery);

        if (!user) {
          // Create new user
          const userData = {
            username,
            walletAddress,
            ...(isEmail ? { email: identifier } : { phone: identifier }),
          };

          user = new User(userData);
          await user.save();
          isNewUser = true;
        } else {
          // Update last login
          user.lastLogin = Date.now();
          await user.save();
        }
      } catch (dbError) {
        // Fallback to in-memory storage
        console.log('Using in-memory storage');

        const key = identifier;
        if (!inMemoryUsers.has(key)) {
          user = {
            _id: Date.now().toString(),
            username,
            walletAddress,
            email: isEmail ? identifier : null,
            phone: !isEmail ? identifier : null,
            createdAt: new Date(),
            lastLogin: new Date(),
          };
          inMemoryUsers.set(key, user);
          isNewUser = true;
        } else {
          user = inMemoryUsers.get(key);
          user.lastLogin = new Date();
        }
      }

      // Generate JWT token
      const token = generateToken(user._id, walletAddress);

      res.json({
        success: true,
        isNewUser,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          walletAddress: user.walletAddress,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during authentication' });
    }
  }
);

// Get user profile
router.get('/profile/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    let user;
    try {
      user = await User.findOne({ walletAddress });
    } catch (dbError) {
      // Search in-memory storage
      for (const [, userData] of inMemoryUsers) {
        if (userData.walletAddress === walletAddress) {
          user = userData;
          break;
        }
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search user by username or wallet address
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let users = [];

    try {
      // Search in MongoDB
      users = await User.find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { walletAddress: { $regex: query, $options: 'i' } },
        ],
      }).limit(10);
    } catch (dbError) {
      // Search in-memory storage
      for (const [, user] of inMemoryUsers) {
        if (
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.walletAddress.toLowerCase().includes(query.toLowerCase())
        ) {
          users.push(user);
        }
      }
    }

    res.json({
      success: true,
      users: users.map(u => ({
        username: u.username,
        walletAddress: u.walletAddress,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
