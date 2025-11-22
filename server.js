const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OpenRide API Running");
});

// Routes will go here later

const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const rideRoutes = require("./routes/rideRoutes");
const aiRoutes = require("./routes/aiRoutes");
const distanceRoutes = require("./routes/distanceRoutes");
//const cors = require("cors");

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/ai", aiRoutes);
app.use("/api", userRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/ride", rideRoutes);
app.use("/api", distanceRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
