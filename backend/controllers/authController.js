const crypto = require("crypto");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const { sendTokenResponse } = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const getFrontendBaseUrl = () => {
  return (process.env.FRONTEND_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
/**
 * @route   POST /api/auth/send-verification
 * @desc    Step 1: Send verification link to email
 * @access  Public
 */
exports.sendVerificationLink = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, error: "Please enter a valid email address." });
    }

    let existingUser = await User.findOne({ email });

    // Prevent duplicate verified accounts.
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        error: "An account with this email already exists and is verified.",
      });
    }

    // Remove old placeholder rows created by the previous verification flow.
    if (existingUser && !existingUser.isVerified && existingUser.name === "Temporary User") {
      await User.deleteOne({ _id: existingUser._id });
      existingUser = null;
    }

    let pendingRegistration = await PendingRegistration.findOne({ email });
    if (!pendingRegistration) {
      pendingRegistration = new PendingRegistration({ email });
    }

    const verifyToken = pendingRegistration.createVerificationToken();
    await pendingRegistration.save();

    const frontendBaseUrl = getFrontendBaseUrl();
    const verifyUrl = `${frontendBaseUrl}/complete-registration?token=${encodeURIComponent(
      verifyToken
    )}&email=${encodeURIComponent(email)}`;

    const message = `Please verify your email to continue your registration:\n\n${verifyUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #6366f1;">Verify Your Email</h2>
        <p>You're almost there! Click the button below to verify your email and complete your registration:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background-color: #6366f1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(99,102,241,0.3);">Complete Registration</a>
        </div>
        <p style="font-size: 13px; color: #777;">If the button doesn't work, copy and paste this link:</p>
        <p style="font-size: 12px; color: #6366f1; word-break: break-all;">${verifyUrl}</p>
      </div>
    `;

    try {
      const info = await sendEmail({
        email,
        subject: "Verify your email - Airbnb Clone",
        message,
        html,
      });

      console.log(`Verification email sent to ${email}. Message ID: ${info?.messageId || "N/A"}`);

      res.status(200).json({
        success: true,
        message: `Verification link sent to ${email}`,
      });
    } catch (err) {
      console.error("sendVerificationLink email error:", err.message);
      await PendingRegistration.deleteOne({ email });
      return res.status(500).json({
        success: false,
        error: "Email could not be sent. Please check email configuration and try again.",
      });
    }
  } catch (err) {
    console.error("sendVerificationLink unexpected error:", err.message);
    res.status(500).json({ success: false, error: "Failed to send verification link." });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Step 2: Finalize registration with Name and Password
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const password = String(req.body?.password || "");
    const token = String(req.body?.token || "");
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!name || !password || !token) {
      return res.status(400).json({ success: false, error: "All fields and token are required." });
    }

    // Hash the token to compare
    const verificationToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const pendingQuery = {
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    };

    if (email) {
      pendingQuery.email = email;
    }

    const pendingRegistration = await PendingRegistration.findOne(pendingQuery);

    if (!pendingRegistration) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification session. Please start again.",
      });
    }

    let user = await User.findOne({ email: pendingRegistration.email });

    if (user && user.isVerified) {
      await PendingRegistration.deleteMany({ email: pendingRegistration.email });
      return res.status(400).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }

    if (user) {
      user.name = name;
      user.password = password;
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
    } else {
      user = new User({
        name,
        email: pendingRegistration.email,
        password,
        isVerified: true,
      });
    }

    await user.save();
    await PendingRegistration.deleteMany({ email: pendingRegistration.email });

    sendTokenResponse(res, 201, user, "user");
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({ success: false, error: message });
    }
    console.error("Finalize register error:", err.message);
    res.status(500).json({ success: false, error: "Failed to complete registration." });
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

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email to login.",
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

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email token
 * @access  Public
 */
exports.verifyEmail = async (req, res) => {
  try {
    // Hash token from URL
    const verificationToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const pendingRegistration = await PendingRegistration.findOne({
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (pendingRegistration) {
      return res.json({
        success: true,
        email: pendingRegistration.email,
        message: "Email verified. Please complete registration.",
      });
    }

    // Backward compatibility for links created by the previous User-based flow.
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpire: { $gt: Date.now() },
    });

    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.json({ success: true, message: "Email verified successfully!" });
    }

    return res.status(400).json({
      success: false,
      error: "Invalid or expired verification token.",
    });
  } catch (err) {
    console.error("Verify email error:", err.message);
    res.status(500).json({ success: false, error: "Failed to verify email." });
  }
};
