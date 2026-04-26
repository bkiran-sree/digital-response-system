const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");   // ✅ For scheduled tasks (news update)
const axios = require("axios");      // ✅ Used to fetch live news

require("dotenv").config();          // ✅ Loads .env variables

// ✅ Import Auth Routes
const authRoutes = require("./routes/authRoutes");

const NEWS_API_KEY = process.env.NEWS_API_KEY;   // ✅ secure API key

const GNEWS_API=process.env.GNEWS_API;
const app = express();
const server = http.createServer(app);

// ✅ Socket setup (Improved CORS)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ✅ Use auth APIs
app.use("/api/auth", authRoutes);

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/disaster_management")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// ✅ Define Schemas
const resourceSchema = new mongoose.Schema({
  resourceName: String,
  resourceType: String,
  quantity: Number,
  location: String,
  contact: String,
  severity: String,
  longitude: Number,
  latitude: Number,
  createdAt: { type: Date, default: Date.now },
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  location: String,
  skills: [String],
  availability: String,
  assignedTask: String,
  longitude: Number,
  latitude: Number,
  joinedAt: { type: Date, default: Date.now },
});

const emergencySchema = new mongoose.Schema({
  description: String,
  contact: String,
  disasterType: String,
  severity: String,
  longitude: Number,
  latitude: Number,
  timestamp: { type: Date, default: Date.now },
});

// ✅ Models
const Resource = mongoose.model("Resource", resourceSchema);
const Volunteer = mongoose.model("Volunteer", volunteerSchema);
const Emergency = mongoose.model("Emergency", emergencySchema);

// ----------------------------------------------------------
// ✅ GET API ROUTES (used in tables)
// ----------------------------------------------------------

app.get("/api/resources", async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.json(resources);
  } catch {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.get("/api/volunteers", async (req, res) => {
  try {
    const volunteers = await Volunteer.find({});
    res.json(volunteers);
  } catch {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

app.get("/api/emergencies", async (req, res) => {
  try {
    const emergencies = await Emergency.find({});
    res.json(emergencies);
  } catch {
    res.status(500).json({ error: "Failed to fetch emergencies" });
  }
});

// ----------------------------------------------------------
// ✅ MAP DATA (Leaflet map reads from here)
// ----------------------------------------------------------

app.get("/api/mapdata", async (req, res) => {
  try {
    const emergencies = await Emergency.find({});
    const resources = await Resource.find({});
    const volunteers = await Volunteer.find({});
    res.json({ emergencies, resources, volunteers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch map data" });
  }
});

// ----------------------------------------------------------
// ✅ POST ROUTES (add data + notifications emit)
// ----------------------------------------------------------

app.post("/api/resources/add", async (req, res) => {
  try {
    const newResource = new Resource({
      ...req.body,
      longitude: 78.4867 + Math.random() * 0.3,
      latitude: 17.385 + Math.random() * 0.3,
    });

    await newResource.save();
    io.emit("newResource", newResource);
    io.emit("receiveAlert", { type: "Resource", data: newResource }); // ✅ notification
    res.json(newResource);
  } catch {
    res.status(500).json({ error: "Failed to add resource" });
  }
});

app.post("/api/volunteers/add", async (req, res) => {
  try {
    const newVolunteer = new Volunteer({
      ...req.body,
      longitude: 78.4867 + Math.random() * 0.3,
      latitude: 17.385 + Math.random() * 0.3,
    });

    await newVolunteer.save();
    io.emit("newVolunteer", newVolunteer);
    io.emit("receiveAlert", { type: "Volunteer", data: newVolunteer }); // ✅ notification
    res.json(newVolunteer);
  } catch {
    res.status(500).json({ error: "Failed to add volunteer" });
  }
});

app.post("/api/emergencies/add", async (req, res) => {
  try {
    const newEmergency = new Emergency({
      ...req.body,
      longitude: 78.4867 + Math.random() * 0.3,
      latitude: 17.385 + Math.random() * 0.3,
    });

    await newEmergency.save();
    io.emit("newEmergency", newEmergency);
    io.emit("receiveAlert", { type: "Emergency", data: newEmergency }); // ✅ notification
    res.json(newEmergency);
  } catch {
    res.status(500).json({ error: "Failed to add emergency" });
  }
});

// ----------------------------------------------------------
// ✅ LIVE NEWS FETCHING (Every 2 mins during development)
// ----------------------------------------------------------

cron.schedule("*/2 * * * *", async () => {
  console.log("⏳ Fetching latest disaster news…");

  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=disaster OR earthquake OR flood OR wildfire OR heavy rains &lang=en&max=5&token=4d28e1f98db3a7cb8d1e6c3b43a53220`
    );

    const latestNews = response.data.articles?.[0];

    if (latestNews) {
      io.emit("receiveNews", latestNews);
      console.log("🟢 News sent:", latestNews.title);
    }
  } catch (err) {
    console.error("❌ News API Error:", err.response?.data || err);
  }
});

// ----------------------------------------------------------

app.get("/", (req, res) => {
  res.send("🌍 Disaster Management Backend Running");
});

// ✅ Start Server
server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
