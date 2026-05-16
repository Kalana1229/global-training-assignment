require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");

const jobRoutes = require("./routes/jobs");
const errorHandler = require("./middleware/errorHandler");

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/jobs", jobRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "GlobalTNA API is running", status: "ok" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

function startServer(port, attemptsLeft = 5) {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      console.warn(`Port ${port} in use.`);
      if (attemptsLeft > 0) {
        const nextPort = port + 1;
        console.warn(`Trying port ${nextPort} (${attemptsLeft - 1} attempts left)...`);
        setTimeout(() => startServer(nextPort, attemptsLeft - 1), 300);
      } else {
        console.error("No available ports to bind. Exiting.");
        process.exit(1);
      }
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });
}

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/globaltna")
  .then(() => {
    console.log("✅ Connected to MongoDB");
    startServer(PORT);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app; // export for testing
