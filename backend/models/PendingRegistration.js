const crypto = require("crypto");
const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    verificationToken: {
      type: String,
      required: true,
    },
    verificationTokenExpire: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

pendingRegistrationSchema.methods.createVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto.createHash("sha256").update(verifyToken).digest("hex");
  this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
  return verifyToken;
};

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);
