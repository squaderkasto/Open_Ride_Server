const express = require("express");
const auth = require("../middleware/auth");
const Vehicle = require("../models/Vehicle");

const router = express.Router();

// Add new vehicle (POST /api/vehicle)
router.post("/", auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, ownerId: req.user });
    res.status(201).json(vehicle);
  } catch (err) {
    const { vehicleType, numberPlate, baseFare, perKmRate, seats } = req.body;
    if (!vehicleType || !numberPlate || !baseFare || !perKmRate || !seats) {
      return res.status(400).json({ message: "All fields required" });
    }

    res.status(500).json({ error: "Error adding vehicle" });
  }
});

// Get all vehicles (GET /api/vehicle)
router.get("/", async (req, res) => {
  const vehicles = await Vehicle.find();
  res.json(vehicles);
});

router.get("/my", auth, async (req, res) => {
  const vehicles = await Vehicle.find({ ownerId: req.user }); // ✅ Correct

  res.json(vehicles);
});

// Get specific vehicle by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching vehicle" });
  }
});

// Update vehicle by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Vehicle not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server error while updating vehicle" });
  }
});

module.exports = router;
