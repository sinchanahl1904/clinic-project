const User = require("../models/User");
const jwt  = require("jsonwebtoken");

const makeToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ ok: false, message: "Name, email and password are required." });

    if (password !== confirmPassword)
      return res.status(400).json({ ok: false, message: "Passwords do not match." });

    if (password.length < 6)
      return res.status(400).json({ ok: false, message: "Password must be at least 6 characters." });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ ok: false, message: "Email already registered." });

    // ✅ Pass plain password — User model pre-save hook hashes it automatically
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,         // plain text here!
      phone: phone || "",
      role: "patient"
    });

    return res.status(201).json({
      ok: true,
      token:  makeToken(user._id, user.role),
      role:   user.role,
      name:   user.name,
      email:  user.email,
      userId: user._id,
      message: "Registration successful!"
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ ok: false, message: "Registration failed.", error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Email and password are required." });

    // select('+password') because password has select:false in schema
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ ok: false, message: "Invalid email or password." });

    return res.json({
      ok: true,
      token:  makeToken(user._id, user.role),
      role:   user.role,
      name:   user.name,
      email:  user.email,
      userId: user._id
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ ok: false, message: "Login failed.", error: err.message });
  }
};

// GET /api/auth/profile  (protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ ok: false, message: "User not found." });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true, message: "Logged out." });
};
