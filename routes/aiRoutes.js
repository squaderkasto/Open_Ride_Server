const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/fare", async (req, res) => {
  let vehicleType, distanceKm, time, location;

  try {
    ({ vehicleType, distanceKm, time, location } = req.body);

    if (!vehicleType || !distanceKm || !time || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  } catch (err) {
    console.error("Invalid request body:", err.message);
    return res.status(400).json({ error: "Invalid request format" });
  }

  const prompt = `
Suggest a realistic fare in INR for a ${vehicleType} ride of ${distanceKm} km in ${location} at ${time}. 
Use current Indian taxi/auto pricing trends. Return only the number.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ correct model ID

    const result = await model.generateContent(prompt);
    console.log("Gemini response:", result);
    const text = result.response.text();

    const numberMatch = text.match(/\d+/);
    if (!numberMatch) {
      return res.status(200).json({ suggestedFare: 100 }); // fallback
    }

    return res.status(200).json({ suggestedFare: numberMatch[0] });
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return res.status(500).json({ error: "Gemini API failed" });
  }
});

module.exports = router;
