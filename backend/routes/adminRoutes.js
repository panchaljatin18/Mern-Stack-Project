const express = require("express");
const {
  login,
  registerSuperAdmin,
  createAdmin,
  getMe,
  listAdmins,
  toggleAdminStatus,
} = require("../controllers/adminAuthController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/register", registerSuperAdmin);
router.post("/create-admin", protect, authorize("super_admin"), createAdmin);
router.get("/me", protect, getMe);
router.get("/list", protect, authorize("super_admin"), listAdmins);
router.put("/toggle-status/:id", protect, authorize("super_admin"), toggleAdminStatus);

module.exports = router;
