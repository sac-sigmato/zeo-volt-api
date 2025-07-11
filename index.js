require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sac:Nj0TAMEizpoJ08wN@cluster0.cbtzzrk.mongodb.net/zeo-volt"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth.routes");

// Basic test route
app.get("/test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Use routes
app.use("/auth", authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
