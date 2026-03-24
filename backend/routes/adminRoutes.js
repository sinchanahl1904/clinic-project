const router = require("express").Router();
const {
  getStats, getAllDoctors, registerDoctor, deleteDoctor,
  getAllUsers, deleteUser, getAllAppointments
} = require("../controllers/adminController");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

const isAdmin = [auth, requireRole(["admin"])];

router.get("/stats",              ...isAdmin, getStats);
router.get("/doctors",            ...isAdmin, getAllDoctors);
router.post("/register-doctor",   ...isAdmin, registerDoctor);
router.delete("/doctors/:id",     ...isAdmin, deleteDoctor);
router.get("/users",              ...isAdmin, getAllUsers);
router.delete("/users/:id",       ...isAdmin, deleteUser);
router.get("/appointments",       ...isAdmin, getAllAppointments);

module.exports = router;
