const mongoose = require("mongoose");
const dns = require("dns");

// Force Google DNS to bypass ISP blocking MongoDB SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    // Check if MongoDB URI exists
    if (!uri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      family: 4, // Force IPv4 — fixes ISP DNS SRV issues
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.error("The backend will continue running, but database-dependent features will fail.");

    // process.exit(1);
  }
};

module.exports = { connectDB };