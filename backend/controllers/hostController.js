const Home = require("../models/Home");

exports.getHomes = (_req, res) => {
  try {
    Home.fetchAll((homes) => res.json(homes));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch homes" });
  }
};

exports.addHome = (req, res) => {
  try {
    const { houseName, price, location, rating, photoUrl } = req.body;
    if (!houseName || !price || !location || !rating || !photoUrl) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }
    const home = new Home(houseName.trim(), price, location.trim(), rating, photoUrl.trim());
    home.save();
    res.json({ success: true, id: home.id });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to add home" });
  }
};

exports.updateHome = (req, res) => {
  try {
    const { houseName, price, location, rating, photoUrl } = req.body;
    Home.updateById(req.params.id, { houseName, price, location, rating, photoUrl }, () =>
      res.json({ success: true })
    );
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update home" });
  }
};

exports.deleteHome = (req, res) => {
  try {
    Home.deleteById(req.params.id, () => res.json({ success: true }));
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete home" });
  }
};
