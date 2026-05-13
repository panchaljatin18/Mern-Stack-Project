const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");

// Load backend/.env no matter where node is started from.
dotenv.config({ path: path.join(__dirname, ".env") });

// Route files
const storeRoutes = require("./routes/storeRoutes");
const hostRoutes = require("./routes/hostRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Body parser
app.use(express.json());

app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, error: "Invalid JSON body." });
  }

  return next(err);
});

// Enable CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests and tools that do not send Origin.
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/host", hostRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", storeRoutes);

// Simple health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/", (_req, res) => {
  res.send("Backend API Running");
});

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  // Wait for the DB connection attempt so first auth requests do not hang on startup.
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
    );
  });
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, _promise) => {
  console.log(`Error: ${err.message}`);

  // Close server & exit process
  // server.close(() => process.exit(1));
});
