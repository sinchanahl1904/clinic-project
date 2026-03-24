const Branch = require("../models/Branch");

// GET /api/branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/branches/count
exports.getBranchCount = async (req, res) => {
  try {
    const count = await Branch.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/branches/:id
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found." });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/branches  (admin only)
exports.createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ message: "Branch created.", branch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/branches/:id  (admin only)
exports.deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
