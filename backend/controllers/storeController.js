const Home = require("../models/Home");

exports.getHomes = (_req, res) => {
  try {
    Home.fetchAll((homes) => res.json(homes));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch homes" });
  }
};

exports.getHomeById = (req, res) => {
  try {
    Home.findById(req.params.id, (home) => {
      if (!home) return res.status(404).json({ success: false, error: "Home not found" });
      res.json(home);
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch home" });
  }
};

exports.postBookHome = (req, res) => {
  try {
    const { userName } = req.body;
    if (!userName || !userName.trim()) {
      return res.status(400).json({ success: false, error: "Username is required" });
    }
    Home.bookById(req.params.id, userName.trim(), (home) => {
      if (!home) return res.status(404).json({ success: false, error: "Home not found" });
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Booking failed" });
  }
};

exports.getBookings = (_req, res) => {
  try {
    Home.fetchBookings((bookings) => res.json(bookings));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
};

exports.deleteBooking = (req, res) => {
  try {
    const { bookedAt } = req.body;
    if (!bookedAt) {
      return res.status(400).json({ success: false, error: "bookedAt is required" });
    }
    Home.deleteBooking(req.params.id, bookedAt, () => res.json({ success: true }));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete booking" });
  }
};

exports.getFavourites = (_req, res) => {
  try {
    Home.fetchFavourites((favs) => res.json(favs));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch favourites" });
  }
};

exports.addFavourite = (req, res) => {
  try {
    Home.findById(req.params.id, (home) => {
      if (!home) return res.status(404).json({ success: false, error: "Home not found" });
      Home.addFavourite(home, () => res.json({ success: true }));
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to add favourite" });
  }
};

exports.removeFavourite = (req, res) => {
  try {
    Home.removeFavourite(req.params.id, () => res.json({ success: true }));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to remove favourite" });
  }
};
