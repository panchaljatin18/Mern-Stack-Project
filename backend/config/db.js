const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log("⚠️  MONGODB_URI not set — auth features disabled. Set it in .env file.");
      return;
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`⚠️  MongoDB connection failed: ${err.message}`);
    console.log("   Auth features will be unavailable. Install MongoDB or use Atlas URI.");
    console.log("   Other features (homes, bookings) will work fine with file storage.");
  }
};

const getConnectionStatus = () => isConnected;

module.exports = { connectDB, getConnectionStatus };
