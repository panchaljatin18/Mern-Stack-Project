const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const storeRoutes = require("./routes/storeRoutes");
const hostRoutes = require("./routes/hostRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api", storeRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/", (req, res) => {
  res.send("Backend API Running");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, _promise) => {
  console.log(`Error: ${err.message}`);

  // Close server & exit process
  // server.close(() => process.exit(1));
});