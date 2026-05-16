// Global error handler - must have 4 parameters for Express to treat it as error middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, error: "Invalid resource ID" });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ success: false, error: "Duplicate field value" });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(", ") });
  }

  // Default 500
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
