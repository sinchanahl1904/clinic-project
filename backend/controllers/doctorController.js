const Doctor = require("../models/Doctor");

// GET /api/doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const { search, specialization } = req.query;
    let doctors = await Doctor.find()
      .populate("user", "name email phone")
      .populate("branch", "name address city phone");

    if (specialization)
      doctors = doctors.filter(d => d.specialization?.toLowerCase().includes(specialization.toLowerCase()));
    if (search) {
      const t = search.toLowerCase();
      doctors = doctors.filter(d =>
        d.user?.name?.toLowerCase().includes(t) ||
        d.specialization?.toLowerCase().includes(t) ||
        d.bio?.toLowerCase().includes(t)
      );
    }
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/count
exports.getDoctorCount = async (req, res) => {
  try {
    const count = await Doctor.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("branch", "name address phone");
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/profile/me  (doctor only)
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id })
      .populate("user", "name email phone")
      .populate("branch", "name address");
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found." });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
