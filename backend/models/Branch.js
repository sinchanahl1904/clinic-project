const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city:    { type: String, required: true, trim: true },
  phone:   { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }  // [lng, lat]
  }
}, { timestamps: true });

branchSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Branch", branchSchema);
