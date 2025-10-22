const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ethers } = require('ethers');

// In-memory storage fallback (if MongoDB is not available)
const inMemoryUsers = new Map();

// Generate a deterministic wallet address from email
const generateWalletAddress = (email) => {
  // Create a deterministic wallet from email + timestamp for uniqueness
  const hash = ethers.keccak256(ethers.toUtf8Bytes(email + Date.now()));
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

// Register endpoint
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { name, phone, email, password } = req.body;

      console.log('Registration attempt for email:', email);

      let existingUser;
      try {
        existingUser = await User.findOne({ email });
        console.log('Existing user check (MongoDB):', existingUser ? 'Found' : 'Not found');
      } catch (dbError) {
        console.log('MongoDB error, checking in-memory storage');
        // Check in-memory storage
        for (const [, userData] of inMemoryUsers) {
          if (userData.email === email) {
            existingUser = userData;
            break;
          }
        }
        console.log('Existing user check (in-memory):', existingUser ? 'Found' : 'Not found');
      }

      if (existingUser) {
        console.log('Registration failed: Email already exists');
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Generate wallet address
      const walletAddress = generateWalletAddress(email);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('Creating new user...');
      let user;
      try {
        // Create user in MongoDB
        user = new User({
          username: name,
          email,
          phone,
          password: hashedPassword,
          walletAddress
        });
        await user.save();
        console.log('User saved to MongoDB successfully');
      } catch (dbError) {
        // Fallback to in-memory storage
        console.log('MongoDB save failed, using in-memory storage');
        user = {
          _id: Date.now().toString(),
          username: name,
          email,
          phone,
          password: hashedPassword,
          walletAddress,
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        inMemoryUsers.set(email, user);
        console.log('User saved to in-memory storage. Total users:', inMemoryUsers.size);
      }

      // Generate JWT token
      const token = generateToken(user._id, walletAddress);

      res.json({
        success: true,
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
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { email, password } = req.body;

      console.log('Login attempt for email:', email);

      let user;
      try {
        user = await User.findOne({ email });
        console.log('MongoDB search result:', user ? 'User found' : 'User not found');
      } catch (dbError) {
        console.log('MongoDB error, checking in-memory storage');
        // Check in-memory storage
        for (const [, userData] of inMemoryUsers) {
          if (userData.email === email) {
            user = userData;
            break;
          }
        }
        console.log('In-memory search result:', user ? 'User found' : 'User not found');
        console.log('In-memory users count:', inMemoryUsers.size);
      }

      if (!user) {
        console.log('Login failed: User not found');
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      console.log('User found, verifying password...');
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Login failed: Invalid password');
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Update last login
      try {
        if (user.save) {
          user.lastLogin = Date.now();
          await user.save();
        } else {
          user.lastLogin = new Date();
        }
      } catch (err) {
        console.log('Could not update last login');
      }

      // Generate JWT token
      const token = generateToken(user._id, user.walletAddress);

      res.json({
        success: true,
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
      res.status(500).json({ error: 'Server error during login' });
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
