const router = require("express").Router();
const { getAllBranches, getBranchCount, getBranchById, createBranch, deleteBranch } = require("../controllers/branchController");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

router.get("/count",  getBranchCount);
router.get("/",       getAllBranches);
router.get("/:id",    getBranchById);
router.post("/",      auth, requireRole(["admin"]), createBranch);
router.delete("/:id", auth, requireRole(["admin"]), deleteBranch);

module.exports = router;
