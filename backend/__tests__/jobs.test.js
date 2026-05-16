const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const JobRequest = require("../models/JobRequest");

const MONGO_URI = "mongodb://localhost:27017/globaltna_test";

beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterEach(async () => {
  await JobRequest.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("GET /api/jobs", () => {
  it("returns an empty array when no jobs exist", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it("returns all jobs", async () => {
    await JobRequest.create([
      { title: "Job A", description: "Desc A", category: "Plumbing" },
      { title: "Job B", description: "Desc B", category: "Electrical" },
    ]);
    const res = await request(app).get("/api/jobs");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("filters by category", async () => {
    await JobRequest.create([
      { title: "Job A", description: "Desc A", category: "Plumbing" },
      { title: "Job B", description: "Desc B", category: "Electrical" },
    ]);
    const res = await request(app).get("/api/jobs?category=Plumbing");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("Plumbing");
  });

  it("filters by status", async () => {
    await JobRequest.create([
      { title: "Job A", description: "Desc A", status: "Open" },
      { title: "Job B", description: "Desc B", status: "Closed" },
    ]);
    const res = await request(app).get("/api/jobs?status=Closed");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe("Closed");
  });

  it("searches by keyword in title", async () => {
    await JobRequest.create([
      { title: "Leaking tap repair", description: "Fix the tap" },
      { title: "Paint bedroom", description: "Repaint walls" },
    ]);
    const res = await request(app).get("/api/jobs?search=leaking");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toMatch(/leaking/i);
  });
});

describe("POST /api/jobs", () => {
  it("creates a job with valid data", async () => {
    const payload = {
      title: "Fix leaking pipe",
      description: "Pipe under sink is dripping",
      category: "Plumbing",
      location: "Glasgow",
      contactName: "John Doe",
      contactEmail: "john@example.com",
    };
    const res = await request(app).post("/api/jobs").send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.status).toBe("Open");
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ description: "No title here" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/title/i);
  });

  it("returns 400 when description is missing", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ title: "No description" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await request(app).post("/api/jobs").send({
      title: "Test Job",
      description: "Description here",
      contactEmail: "not-an-email",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("PATCH /api/jobs/:id", () => {
  it("updates job status successfully", async () => {
    const job = await JobRequest.create({
      title: "Test Job",
      description: "Description",
    });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "In Progress" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe("In Progress");
  });

  it("returns 400 for invalid status value", async () => {
    const job = await JobRequest.create({
      title: "Test Job",
      description: "Description",
    });
    const res = await request(app)
      .patch(`/api/jobs/${job._id}`)
      .send({ status: "Unknown" });
    expect(res.statusCode).toBe(400);
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: "Closed" });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/jobs/:id", () => {
  it("deletes a job successfully", async () => {
    const job = await JobRequest.create({
      title: "To Delete",
      description: "Will be deleted",
    });
    const res = await request(app).delete(`/api/jobs/${job._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await JobRequest.findById(job._id);
    expect(check).toBeNull();
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/jobs/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
