const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: {
    type: String,
    required: true,
    select: false   // never returned in queries by default
  },
  role:  { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  phone: { type: String, trim: true, default: "" },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// ✅ Hash password ONCE before saving (only when changed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ✅ Method to compare passwords on login
userSchema.methods.comparePassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
