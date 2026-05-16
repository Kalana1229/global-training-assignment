const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const JobRequest = require("../models/JobRequest");

// Helper: validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/jobs - list all jobs with optional filters and keyword search
router.get("/", async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Keyword search across title and description
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id - fetch a single job
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid job ID format" });
    }

    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs - create a new job
router.post("/", async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // Check required fields explicitly
    const errors = [];
    if (!title || !title.trim()) errors.push("title is required");
    if (!description || !description.trim()) errors.push("description is required");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(", ") });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }
    next(err);
  }
});

// PATCH /api/jobs/:id - update status only
router.patch("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid job ID format" });
    }

    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "Closed"];

    if (!status) {
      return res.status(400).json({ success: false, error: "status field is required" });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id - delete a job
router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: "Invalid job ID format" });
    }

    const job = await JobRequest.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
