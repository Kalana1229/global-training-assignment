const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
        message: "Category must be one of: Plumbing, Electrical, Painting, Joinery, Other",
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: [100, "Contact name cannot exceed 100 characters"],
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "Status must be one of: Open, In Progress, Closed",
      },
      default: "Open",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Index for faster filtering and text search
jobRequestSchema.index({ status: 1, category: 1 });
jobRequestSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("JobRequest", jobRequestSchema, "jobRequests");
