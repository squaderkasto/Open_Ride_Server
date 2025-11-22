const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  fare: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, accepted, completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ride", rideSchema);
