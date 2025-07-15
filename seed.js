require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Project = require("./models/project.model");
const Document = require("./models/document.model");
const Loyalty = require("./models/loyalty.model");
const Referral = require("./models/referral.model");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected for seeding");
};

const seed = async () => {
  await connect();

  await User.deleteMany({});
  await Project.deleteMany({});
  await Document.deleteMany({});
  await Loyalty.deleteMany({});
  await Referral.deleteMany({});

  // Seed Users
  const users = await User.create([
    {
      phone: "+919999000001",
      name: "Customer One",
      email: "customer1@example.com",
      role: "customer",
      isVerified: true,
    },
    {
      phone: "+919999000002",
      name: "Partner One",
      email: "partner1@example.com",
      role: "partner",
      isVerified: true,
    },
    {
      phone: "+919999000003",
      name: "Customer Two",
      email: "customer2@example.com",
      role: "customer",
      isVerified: false,
    },
    {
      phone: "+919999000004",
      name: "Partner Two",
      email: "partner2@example.com",
      role: "partner",
      isVerified: true,
    },
    {
      phone: "+919999000005",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      isVerified: true,
    },
  ]);

  const [customer1, partner1, customer2, partner2] = users;

  // Seed Projects
  await Project.create([
    {
      user: customer1._id,
      title: "Rooftop Solar Installation",
      status: "Completed",
      description: "5KW rooftop system installed in Bangalore",
    },
    {
      user: customer1._id,
      title: "Battery Backup Upgrade",
      status: "In Progress",
      description: "Adding Tesla Powerwall battery backup",
    },
    {
      user: customer2._id,
      title: "Home Solar Evaluation",
      status: "Pending",
      description: "Survey scheduled for next week",
    },
  ]);

  // Seed Documents
  await Document.create([
    {
      user: customer1._id,
      name: "Installation Certificate",
      fileUrl: "https://example.com/certificates/installation.pdf",
    },
    {
      user: customer1._id,
      name: "Invoice",
      fileUrl: "https://example.com/invoices/invoice123.pdf",
    },
    {
      user: customer2._id,
      name: "Survey Report",
      fileUrl: "https://example.com/reports/survey.pdf",
    },
  ]);

  // Seed Loyalty Points
  await Loyalty.create([
    {
      user: customer1._id,
      total: 1500,
      used: 300,
      monthlyCredits: [
        { month: "2025-06", points: 500 },
        { month: "2025-07", points: 1000 },
      ],
    },
    {
      user: customer2._id,
      total: 800,
      used: 100,
      monthlyCredits: [{ month: "2025-07", points: 800 }],
    },
  ]);

  // Seed Referrals
  await Referral.create([
    {
      referredBy: customer1._id,
      name: "Referred Friend 1",
      phone: "+919988776655",
      email: "friend1@example.com",
      status: "Converted",
    },
    {
      referredBy: partner1._id,
      name: "Referred Client 1",
      phone: "+919977665544",
      email: "client1@example.com",
      status: "Pending",
    },
    {
      referredBy: customer2._id,
      name: "Friend 2",
      phone: "+918887665544",
      email: "friend2@example.com",
      status: "Rejected",
    },
  ]);

  console.log("✅ Data seeded successfully!");
  mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  mongoose.disconnect();
});
