const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
  try {
    // Use in-memory storage if MongoDB is not available
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentechain';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, using in-memory storage');
    // App will continue with in-memory user storage
  }
};

module.exports = connectDB;
