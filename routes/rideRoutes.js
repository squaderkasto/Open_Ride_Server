const express = require("express");
const auth = require("../middleware/auth");
const Ride = require("../models/Ride");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

// Book a ride (POST /api/ride)
router.post("/", auth, async (req, res) => {
  const { vehicleId, pickup, drop, distanceKm } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const fare = vehicle.baseFare + vehicle.perKmRate * distanceKm;

    const ride = await Ride.create({
      riderId: req.user,
      driverId: vehicle.ownerId,
      vehicleId,
      pickup,
      drop,
      distanceKm,
      fare,
    });

    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: "Error booking ride" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const riderId = req.user; // from auth middleware
    const rides = await Ride.find({ riderId }) // ✅ filter by riderId
      .populate("vehicleId")
      .populate("driverId", "name") // optional: get driver name
      .sort({ createdAt: -1 }); // newest first

    res.json(rides);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;
