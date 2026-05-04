const express = require("express");
const {
  getHomes,
  getHomeById,
  postBookHome,
  getBookings,
  deleteBooking,
  getFavourites,
  addFavourite,
  removeFavourite,
} = require("../controllers/storeController");

const router = express.Router();

router.get("/homes", getHomes);
router.get("/homes/:id", getHomeById);
router.post("/book/:id", postBookHome);
router.get("/bookings", getBookings);
router.post("/delete-booking/:id", deleteBooking);
router.get("/favourites", getFavourites);
router.post("/add-favourite/:id", addFavourite);
router.post("/remove-favourite/:id", removeFavourite);

module.exports = router;
