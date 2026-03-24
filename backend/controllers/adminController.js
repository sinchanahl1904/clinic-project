const User        = require("../models/User");
const Doctor      = require("../models/Doctor");
const Branch      = require("../models/Branch");
const Appointment = require("../models/Appointment");

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalDoctors, totalBranches, totalAppointments, pendingAppointments] =
      await Promise.all([
        User.countDocuments(),
        Doctor.countDocuments(),
        Branch.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "pending" })
      ]);
    res.json({ ok: true, totalUsers, totalDoctors, totalBranches, totalAppointments, pendingAppointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "name email phone")
      .populate("branch", "name");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/admin/register-doctor
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, phone, branch, experience, education, bio } = req.body;
    if (!name || !email || !password || !specialization)
      return res.status(400).json({ message: "Name, email, password and specialization are required." });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: "Email already registered." });

    // ✅ plain password — User pre-save hook hashes it
    const user = await User.create({
      name, email: email.toLowerCase(), password,
      phone: phone || "", role: "doctor", isVerified: true
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialization,
      contact: phone || "",
      branch: branch || null,
      experience: experience || 5,
      education: education || "MBBS, MD",
      bio: bio || `Expert in ${specialization}`,
      schedule: [
        { day: "Mon", start: "09:00", end: "17:00" },
        { day: "Tue", start: "09:00", end: "17:00" },
        { day: "Wed", start: "09:00", end: "17:00" },
        { day: "Thu", start: "09:00", end: "17:00" },
        { day: "Fri", start: "09:00", end: "17:00" }
      ]
    });

    res.status(201).json({ ok: true, message: "Doctor registered.", doctor: { id: doctor._id, name, email, specialization } });
  } catch (err) {
    console.error("Register doctor error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/doctors/:id
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });
    await User.findByIdAndDelete(doctor.user);
    res.json({ ok: true, message: "Doctor deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "User deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate("patient", "name email")
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .populate("branch", "name")
      .sort({ dateTime: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
