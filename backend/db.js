// In-memory database implementation
const inMemoryDB = {
  users: new Map(),
  transactions: new Map()
};

const connectDB = async () => {
  console.log('✅ Using in-memory storage for development');
  return inMemoryDB;
};

// Export both the connection function and the database object
module.exports = connectDB;
module.exports.db = inMemoryDB;
