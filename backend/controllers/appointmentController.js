const Appointment = require("../models/Appointment");
const Doctor      = require("../models/Doctor");

// POST /api/appointments  (patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, branchId, dateTime, reason } = req.body;
    if (!doctorId || !branchId || !dateTime || !reason)
      return res.status(400).json({ message: "All fields required." });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.availabilityStatus)
      return res.status(400).json({ message: "Doctor not available." });

    const appt = await Appointment.create({
      patient: req.user.id, doctor: doctorId, branch: branchId,
      dateTime: new Date(dateTime), reason
    });
    await appt.populate([
      { path: "patient", select: "name email phone" },
      { path: "doctor", populate: { path: "user", select: "name" } },
      { path: "branch", select: "name address phone" }
    ]);
    res.status(201).json({ ok: true, message: "Appointment booked!", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/patient  (patient)
exports.getPatientAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({ patient: req.user.id })
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .populate("branch", "name address phone")
      .sort({ dateTime: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/doctor  (doctor)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found." });
    const appts = await Appointment.find({ doctor: doctor._id })
      .populate("patient", "name email phone")
      .populate("branch", "name address phone")
      .sort({ dateTime: 1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id/status  (doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted","rejected","completed"].includes(status))
      return res.status(400).json({ message: "Invalid status." });

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(403).json({ message: "Doctor profile not found." });

    const appt = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: doctor._id },
      { status },
      { new: true }
    ).populate("patient", "name email phone");

    if (!appt) return res.status(404).json({ message: "Appointment not found." });
    res.json({ ok: true, message: `Appointment ${status}.`, appointment: appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/appointments/:id  (patient cancel)
exports.cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, patient: req.user.id });
    if (!appt) return res.status(404).json({ message: "Appointment not found." });
    if (appt.status === "completed")
      return res.status(400).json({ message: "Cannot cancel completed appointment." });
    await appt.deleteOne();
    res.json({ ok: true, message: "Appointment cancelled." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/all  (admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find()
      .populate("patient", "name email phone")
      .populate({ path: "doctor", populate: { path: "user", select: "name" } })
      .populate("branch", "name")
      .sort({ dateTime: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
