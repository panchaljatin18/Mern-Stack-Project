const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    // Check if MongoDB URI exists
    if (!uri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);

    // Stop app if DB connection fails
    process.exit(1);
  }
};

module.exports = { connectDB };