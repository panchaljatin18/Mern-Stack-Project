const jwt = require("jsonwebtoken");

/**
 * Sign JWT token with ID and type (user or admin)
 */
const signToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Get token from model, create cookie and send response
 */
const sendTokenResponse = (res, statusCode, userOrAdmin, type) => {
  // Create token
  const token = signToken(userOrAdmin._id, type);

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_EXPIRE_DAYS) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).json({
    success: true,
    token,
    [type]: {
      id: userOrAdmin._id,
      name: userOrAdmin.name,
      email: userOrAdmin.email,
      role: userOrAdmin.role || "user",
    },
  });
};

module.exports = { signToken, verifyToken, sendTokenResponse };
