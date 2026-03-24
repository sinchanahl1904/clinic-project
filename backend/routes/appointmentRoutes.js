const router = require("express").Router();
const {
  bookAppointment, getPatientAppointments, getDoctorAppointments,
  updateAppointmentStatus, cancelAppointment, getAllAppointments
} = require("../controllers/appointmentController");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

router.post("/",              auth, requireRole(["patient"]), bookAppointment);
router.get("/patient",        auth, requireRole(["patient"]), getPatientAppointments);
router.get("/doctor",         auth, requireRole(["doctor"]),  getDoctorAppointments);
router.put("/:id/status",     auth, requireRole(["doctor"]),  updateAppointmentStatus);
router.delete("/:id",         auth, requireRole(["patient"]), cancelAppointment);
router.get("/all",            auth, requireRole(["admin"]),   getAllAppointments);

module.exports = router;
