const router = require("express").Router();
const { getAllDoctors, getDoctorCount, getDoctorById, getDoctorProfile } = require("../controllers/doctorController");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

router.get("/count",       getDoctorCount);
router.get("/",            getAllDoctors);
router.get("/profile/me",  auth, requireRole(["doctor"]), getDoctorProfile);
router.get("/:id",         getDoctorById);

module.exports = router;
