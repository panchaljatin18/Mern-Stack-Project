const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationLink,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();
console.log("✅ Auth Routes Loaded: /api/auth/*");

router.post("/register", register);
router.post("/login", login);
router.post("/send-verification", sendVerificationLink);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
