const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// GET /api/get-distance?origins=lat,lng&destinations=lat,lng
router.get("/get-distance", async (req, res) => {
  const { origins, destinations } = req.query;
  if (!origins || !destinations) {
    return res
      .status(400)
      .json({ error: "origins and destinations are required" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  // Debug: Print API key length and partial value (never log full key in production)
  //   if (!apiKey) {
  //     console.error("[DEBUG] GOOGLE_MAPS_API_KEY is missing or undefined!");
  //     return res
  //       .status(500)
  //       .json({ error: "Google Maps API key not set in environment" });
  //   } else {
  //     console.log(`[DEBUG] GOOGLE_MAPS_API_KEY length: ${apiKey.length}, starts with: ${apiKey.slice(0, 8)}`);
  //   }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origins
  )}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;
  //console.log("[DEBUG] Requesting URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "OK") {
      console.error("Google Maps API error:", data);
      return res
        .status(500)
        .json({ error: "Google Maps API error", details: data });
    }
    res.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch from Google Maps API",
      details: error.message,
    });
  }
});

module.exports = router;
