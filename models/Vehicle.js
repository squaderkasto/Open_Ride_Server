const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["bike", "auto", "cab_economy", "cab_premium"], // standardized types
  },
  numberPlate: { type: String, required: true },
  baseFare: { type: Number, required: true },
  perKmRate: { type: Number, required: true },
  seats: { type: Number, default: 4 }, // bike: 1, auto: 3, car: 4
  description: { type: String }, // Optional (e.g., "Affordable car rides"
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
