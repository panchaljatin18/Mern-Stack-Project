const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const Admin = require("../models/Admin");

/**
 * Protect routes — verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Attach user/admin to request
    if (decoded.type === "admin") {
      const admin = await Admin.findById(decoded.id);
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          error: "Admin account not found or deactivated.",
        });
      }
      req.user = admin;
      req.userType = "admin";
    } else {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found.",
        });
      }
      req.user = user;
      req.userType = "user";
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token." });
    }
    return res.status(500).json({ success: false, error: "Authentication failed." });
  }
};

/**
 * Authorize by roles — must be used AFTER protect middleware
 * @param  {...string} roles - Allowed roles (e.g. "super_admin", "admin")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated." });
    }

    const userRole = req.user.role || "user";

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Role '${userRole}' is not authorized.`,
      });
    }

    next();
  };
};

/**
 * Admin-only middleware — shorthand for protect + admin type check
 */
const adminOnly = async (req, res, next) => {
  if (req.userType !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin only.",
    });
  }
  next();
};

module.exports = { protect, authorize, adminOnly };
