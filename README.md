# CakeBooking - AI Cake Visualizer

A modern website for cake booking with an AI-powered cake visualizer that generates realistic cake images based on user preferences.

## Features

- **AI Cake Visualizer**: Generate realistic cake images using OpenAI's DALL-E 3
- **Interactive Controls**: Customize size, layers, colors, flavors, and decorations
- **Real-time Prompt Generation**: See the AI prompt being generated as you make selections
- **Simple Express Server**: Direct API proxy to OpenAI for image generation

## Setup

### Prerequisites

- Node.js (v16 or higher)
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3000`

## Project Structure

```
├── server.js                  # Express server
├── index.html                 # Main landing page
├── wizualizator-tortow.html   # AI Cake Visualizer
├── cake-visualizer-ai.js      # Frontend AI logic
├── images/                    # Static images
├── blog/                      # Blog posts
└── legal/                     # Legal pages
```

## API Endpoints

- `POST /api/generate-image` - Generate AI images
- `GET /api/health` - Health check

## AI Visualizer Features

- **Size Selection**: Small, medium, large cakes
- **Layer Control**: 1-5 layers
- **Color Options**: 10 different base colors
- **Additional Colors**: Gold, silver, rose-gold accents
- **Occasions**: Birthday, wedding, anniversary, graduation, celebration
- **Flavors**: Vanilla, chocolate, strawberry, lemon, caramel
- **Decorations**: Candles, flowers, berries, sprinkles
- **Custom Text**: Add personalized messages

## Technologies Used

- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Font Awesome for icons
- Express.js for server
- OpenAI DALL-E 3 for image generation
- Node-fetch for API calls

## License

MIT License 