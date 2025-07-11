import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Image generation endpoint
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, size = "1024x1024" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    console.log(`Generating image with prompt: ${prompt.substring(0, 100)}...`);

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: size,
        quality: "high",
        n: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: "OpenAI API error", 
        details: errorText 
      });
    }

    const result = await response.json();
    console.log("OpenAI response received:", Object.keys(result));

    // Handle base64 image data (newer API response format)
    if (result?.data?.[0]?.b64_json) {
      console.log("Base64 image data received, returning...");
      
      const base64Image = result.data[0].b64_json;
      
      return res.json({
        status: "success",
        imageUrl: `data:image/png;base64,${base64Image}`,
        format: "base64"
      });
      
    } else if (result?.data?.[0]?.url) {
      console.log("Image URL received, downloading...");
      
      // Download the image to avoid CORS issues
      const imageResponse = await fetch(result.data[0].url, { timeout: 30000 });
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      
      return res.json({
        status: "success",
        imageUrl: `data:image/png;base64,${base64Image}`,
        originalUrl: result.data[0].url,
        format: "url"
      });
      
    } else {
      console.error("Unexpected response format:", result);
      return res.status(500).json({
        error: "Invalid OpenAI response format",
        details: result
      });
    }

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Failed to generate image",
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📸 Image generation endpoint: http://localhost:${PORT}/api/generate-image`);
}); 