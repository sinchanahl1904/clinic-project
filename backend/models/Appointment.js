const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
  doctor:   { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  branch:   { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  dateTime: { type: Date, required: true },
  reason:   { type: String, required: true, trim: true },
  status:   { type: String, enum: ["pending","accepted","rejected","completed"], default: "pending" },
  notes:    { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
