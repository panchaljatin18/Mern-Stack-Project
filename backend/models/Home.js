const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const storeFiles = ["homes.json", "bookings.json", "favourites.json"];

/* ── Ensure data directory & files exist ── */
const ensureStore = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  storeFiles.forEach((fileName) => {
    const filePath = path.join(dataDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }
  });
};
ensureStore();

/* ── In-memory cache ── */
const cache = {};

const readList = (fileName) => {
  if (cache[fileName]) return cache[fileName];
  try {
    const data = fs.readFileSync(path.join(dataDir, fileName), "utf8");
    const parsed = JSON.parse(data);
    cache[fileName] = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache[fileName] = [];
    fs.writeFileSync(path.join(dataDir, fileName), "[]");
  }
  return cache[fileName];
};

/* Debounced write – batches rapid successive writes into one disk operation */
const pendingWrites = {};
const WRITE_DELAY = 100; // ms

const writeList = (fileName, list) => {
  cache[fileName] = list;

  if (pendingWrites[fileName]) clearTimeout(pendingWrites[fileName]);

  pendingWrites[fileName] = setTimeout(() => {
    const filePath = path.join(dataDir, fileName);
    fs.writeFile(filePath, JSON.stringify(list, null, 2), (err) => {
      if (err) console.error(`Write error (${fileName}):`, err.message);
    });
    delete pendingWrites[fileName];
  }, WRITE_DELAY);
};

/* ── Home class ── */
module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl, id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.id = id || Date.now().toString();
  }

  save() {
    const homes = readList("homes.json");
    homes.push(this);
    writeList("homes.json", homes);
  }

  static fetchAll(callback) {
    callback(readList("homes.json"));
  }

  static findById(id, callback) {
    const homes = readList("homes.json");
    callback(homes.find((h) => h.id === id));
  }

  static updateById(id, updatedData, callback) {
    const homes = readList("homes.json");
    const index = homes.findIndex((h) => h.id === id);
    if (index !== -1) homes[index] = { ...homes[index], ...updatedData };
    writeList("homes.json", homes);
    callback();
  }

  static deleteById(id, callback) {
    const homes = readList("homes.json");
    const filtered = homes.filter((h) => h.id !== id);
    writeList("homes.json", filtered);
    callback();
  }

  static bookById(id, userName, callback) {
    let home = readList("homes.json").find((h) => h.id === id);
    // Fallback: check favourites (user may be booking from favourites page)
    if (!home) {
      home = readList("favourites.json").find((f) => f.id === id);
    }
    if (!home) return callback(null);

    const bookings = readList("bookings.json");
    bookings.push({ ...home, userName, bookedAt: new Date().toLocaleString() });
    writeList("bookings.json", bookings);
    callback(home);
  }

  static fetchBookings(callback) {
    callback(readList("bookings.json"));
  }

  static fetchFavourites(callback) {
    callback(readList("favourites.json"));
  }

  static addFavourite(home, callback) {
    const favs = readList("favourites.json");
    if (favs.find((f) => f.id === home.id)) return callback();
    favs.push(home);
    writeList("favourites.json", favs);
    callback();
  }

  static removeFavourite(id, callback) {
    const favs = readList("favourites.json");
    const filtered = favs.filter((f) => f.id !== id);
    writeList("favourites.json", filtered);
    callback();
  }

  static deleteBooking(id, bookedAt, callback) {
    const bookings = readList("bookings.json");
    const filtered = bookings.filter((b) => !(b.id === id && b.bookedAt === bookedAt));
    writeList("bookings.json", filtered);
    callback();
  }
};
