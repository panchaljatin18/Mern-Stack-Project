const express = require("express");
const {
  login,
  registerSuperAdmin,
  createAdmin,
  getMe,
  listAdmins,
  toggleAdminStatus,
  listUsers,
  updateUser,
  deleteUser,
} = require("../controllers/adminAuthController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/register", registerSuperAdmin);
router.post("/create-admin", protect, authorize("super_admin"), createAdmin);
router.get("/me", protect, getMe);
router.get("/list", protect, authorize("super_admin"), listAdmins);
router.get("/users", protect, listUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
router.put("/toggle-status/:id", protect, authorize("super_admin"), toggleAdminStatus);

module.exports = router;
