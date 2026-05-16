require("dotenv").config();
const mongoose = require("mongoose");
const JobRequest = require("./models/JobRequest");

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs urgent fixing",
    description:
      "The kitchen tap has been dripping for two weeks and the drip is getting worse. Need a qualified plumber to replace the washer or the entire tap unit if needed.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Sarah Mitchell",
    contactEmail: "sarah.mitchell@example.com",
    status: "Open",
  },
  {
    title: "Outdoor garden lights installation",
    description:
      "Looking to install 6 low-voltage garden lights along the driveway and near the front door. Trenching and cabling required. Must comply with Part P regulations.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "James Thornton",
    contactEmail: "j.thornton@example.com",
    status: "Open",
  },
  {
    title: "Full bedroom repaint - 2 rooms",
    description:
      "Two bedrooms need a full repaint including ceiling and woodwork. Walls currently magnolia and I'd like a light grey finish. Approx 12m² and 10m² rooms.",
    category: "Painting",
    location: "Manchester",
    contactName: "Emily Clarke",
    contactEmail: "emily.c@example.com",
    status: "In Progress",
  },
  {
    title: "Bespoke fitted wardrobe for master bedroom",
    description:
      "Need a fitted wardrobe built into an alcove. Dimensions roughly 2.4m wide x 2.1m tall x 0.6m deep. Would like hanging rail, shelves, and soft-close doors.",
    category: "Joinery",
    location: "Birmingham",
    contactName: "Robert Hughes",
    contactEmail: "rob.hughes@example.com",
    status: "Open",
  },
  {
    title: "Consumer unit replacement - old fuse box",
    description:
      "Old rewirable fuse box needs replacing with a modern consumer unit with RCDs and MCBs. House is a 3-bed semi from the 1970s. Full inspection certificate required.",
    category: "Electrical",
    location: "Leeds",
    contactName: "Patricia Wong",
    contactEmail: "pat.wong@example.com",
    status: "Open",
  },
  {
    title: "Bathroom silicone resealing around bath",
    description:
      "The silicone seal around the bath and shower tray has gone black with mould. Need old silicone removed and fresh silicone applied neatly. Small job but important.",
    category: "Plumbing",
    location: "Bristol",
    contactName: "Daniel Foster",
    contactEmail: "d.foster@example.com",
    status: "Closed",
  },
  {
    title: "Exterior house painting - front and side",
    description:
      "Semi-detached house needs exterior masonry paint on front and side elevations. Current paint is peeling in places. Scaffolding may be required for gable end.",
    category: "Painting",
    location: "Cardiff",
    contactName: "Angela Reeves",
    contactEmail: "angela.r@example.com",
    status: "Open",
  },
  {
    title: "Skirting boards replacement throughout house",
    description:
      "Old damaged skirting boards need replacing in hallway, living room, and dining room. Roughly 30 linear metres total. Prefer ogee profile to match existing doors.",
    category: "Joinery",
    location: "Glasgow",
    contactName: "Michael Sinclair",
    contactEmail: "m.sinclair@example.com",
    status: "In Progress",
  },
  {
    title: "Boiler pressure keeps dropping - inspection needed",
    description:
      "Combi boiler loses pressure every few days and needs topping up. Suspect a small leak somewhere in the system or a faulty pressure relief valve. Needs a Gas Safe engineer.",
    category: "Plumbing",
    location: "Newcastle",
    contactName: "Karen O'Brien",
    contactEmail: "karen.ob@example.com",
    status: "Open",
  },
  {
    title: "Kitchen under-cabinet LED lighting",
    description:
      "Would like LED strip lights installed under kitchen wall units with a single switch. 5 units total, roughly 600mm each. Prefer hardwired rather than plug-in solution.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Thomas Grant",
    contactEmail: "t.grant@example.com",
    status: "Open",
  },
];

async function seed() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/globaltna"
    );
    console.log("✅ Connected to MongoDB");

    await JobRequest.deleteMany({});
    console.log("🗑️  Cleared existing job requests");

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Seeded ${inserted.length} job requests successfully`);

    await mongoose.disconnect();
    console.log("✅ Done. Database disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
