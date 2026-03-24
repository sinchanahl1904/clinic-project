const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  specialization: { type: String, required: true, trim: true },
  image:          { type: String, default: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600" },
  contact:        { type: String, default: "" },
  branch:         { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  bio:            { type: String, default: "" },
  experience:     { type: Number, default: 0 },
  education:      { type: String, default: "MBBS, MD" },
  languages:      { type: [String], default: ["English", "Kannada"] },
  rating:         { type: Number, default: 5.0 },
  availabilityStatus: { type: Boolean, default: true },
  schedule: [{
    day:   { type: String, enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] },
    start: { type: String },
    end:   { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);
