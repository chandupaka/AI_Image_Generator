// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

app.use(cors()); // allow all origins
app.use(express.json()); // parse JSON requests

// Route to handle image generation securely
app.post("/api/generate", async (req, res) => {
  const { prompt, model, size } = req.body;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/nscale/v1/images/generations",
      {
        prompt,
        model,
        response_format: "b64_json",
        num_images: 1,
        size,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "x-use-cache": "false",
        },
      }
    );

    res.json(response.data); // send back base64 JSON to frontend
  } catch (error) {
    console.error("Error from Hugging Face API:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
