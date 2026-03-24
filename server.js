require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ── API Routes ──────────────────────────────────────────────
app.use("/api/auth",         require("./backend/routes/authRoutes"));
app.use("/api/doctors",      require("./backend/routes/doctorRoutes"));
app.use("/api/appointments", require("./backend/routes/appointmentRoutes"));
app.use("/api/branches",     require("./backend/routes/branchRoutes"));
app.use("/api/admin",        require("./backend/routes/adminRoutes"));

// ── Serve Frontend ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, "frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ ok: false, message: err.message });
});

// ── Database + Server Start ─────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/clinicDB";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
