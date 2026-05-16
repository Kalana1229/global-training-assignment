require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");

const jobRoutes = require("./routes/jobs");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ======================
// Middleware
// ======================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    credentials: true,
  })
);

app.use(express.json());

// ======================
// Routes
// ======================
app.use("/api/jobs", jobRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "GlobalTNA API is running",
    status: "ok",
  });
});

// ======================
// 404 handler
// ======================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ======================
// Error handler
// ======================
app.use(errorHandler);

// ======================
// MongoDB Connection
// ======================
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/globaltna")
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// ======================
// EXPORT FOR VERCEL
// ======================
module.exports = serverless(app);