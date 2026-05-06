const User = require("../models/User");
const Admin = require("../models/Admin");
const { sendTokenResponse } = require("../utils/jwt");

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password.",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account deactivated. Contact super admin.",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    sendTokenResponse(res, 200, admin, "admin");
  } catch (err) {
    console.error("Admin login error:", err);

    res.status(500).json({
      success: false,
      error: "Login failed.",
    });
  }
};

/**
 * @route   POST /api/admin/register
 * @desc    Register first super_admin
 * @access  Public
 */
exports.registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide all fields.",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: "Admin already exists with this email.",
      });
    }

    // Create super admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: "super_admin",
      isActive: true,
    });

    sendTokenResponse(res, 201, admin, "admin");
  } catch (err) {
    console.error("Register super admin error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "Email already registered.",
      });
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        error: message,
      });
    }

    res.status(500).json({
      success: false,
      error: err.message || "Registration failed.",
    });
  }
};

/**
 * @route   POST /api/admin/create-admin
 * @desc    Create a new admin
 * @access  Private (super_admin)
 */
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: "An admin with this email already exists.",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || "admin",
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("Create admin error:", err);

    res.status(500).json({
      success: false,
      error: err.message || "Failed to create admin.",
    });
  }
};

/**
 * @route   GET /api/admin/me
 * @desc    Get current admin profile
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    console.error("Get admin profile error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to fetch profile.",
    });
  }
};

/**
 * @route   GET /api/admin/list
 * @desc    List all admins
 * @access  Private (super_admin)
 */
exports.listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (err) {
    console.error("List admins error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to fetch admins.",
    });
  }
};

/**
 * @route   PUT /api/admin/toggle-status/:id
 * @desc    Activate/deactivate admin
 * @access  Private (super_admin)
 */
exports.toggleAdminStatus = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found.",
      });
    }

    // Prevent self-deactivation
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: "You cannot deactivate your own account.",
      });
    }

    admin.isActive = !admin.isActive;

    await admin.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `Admin ${admin.isActive ? "activated" : "deactivated"
        } successfully.`,
      isActive: admin.isActive,
    });
  } catch (err) {
    console.error("Toggle admin status error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to update admin status.",
    });
  }
};
/**
 * @route   GET /api/admin/users
 * @desc    List all registered users
 * @access  Private (admin/super_admin)
 */
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch users." });
  }
};

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user details
 * @access  Private (admin/super_admin)
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: "Update failed." });
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (admin/super_admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    res.json({ success: true, message: "User deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: "Delete failed." });
  }
};
