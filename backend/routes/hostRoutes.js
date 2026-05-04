const express = require("express");
const {
  getHomes,
  addHome,
  updateHome,
  deleteHome,
} = require("../controllers/hostController");

const router = express.Router();

router.get("/homes", getHomes);
router.post("/add-home", addHome);
router.put("/edit-home/:id", updateHome);
router.delete("/delete-home/:id", deleteHome);

module.exports = router;
