const crypto = require("crypto");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/jwt");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    // Create user
    const user = await User.create({ name, email, password });

    sendTokenResponse(res, 201, user, "user");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: "Email already registered." });
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({ success: false, error: message });
    }
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, error: "Registration failed. Please try again." });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    sendTokenResponse(res, 200, user, "user");
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, error: "Login failed. Please try again." });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch profile." });
  }
};

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (avatar !== undefined) updates.avatar = avatar.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update profile." });
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password (logged in user)
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(res, 200, user, "user");
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to change password." });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send reset password token
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not (security)
      return res.json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In production, send email with reset link
    // For now, return the token directly (dev mode)
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;

    res.json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
      // DEV ONLY — remove in production:
      resetToken,
      resetUrl,
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ success: false, error: "Failed to process request." });
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the token from URL to compare with stored hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired reset token.",
      });
    }

    // Set new password & clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(res, 200, user, "user");
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ success: false, error: "Failed to reset password." });
  }
};
