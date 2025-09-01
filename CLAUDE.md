# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `npm run dev` - starts Express server on port 3001
- **Install dependencies**: `npm install`
- **Check server health**: GET request to `/api/health`

## Project Architecture

This is a Node.js web application for cake booking with AI-powered cake visualization using OpenAI's DALL-E 3.

### Core Components

- **Express Server** (`server.js`): Main backend with static file serving and API endpoints
- **AI Cake Visualizer** (`wizualizator-tortow.html` + `cake-visualizer-ai.js`): Interactive cake customization with real-time AI image generation
- **Frontend Pages**: Multiple HTML pages for landing, contact, blog, and legal content
- **Static Assets**: Organized cake images in categorized folders (`images/weselne/`, `images/chrzestne/`, etc.)

### API Endpoints

- `POST /api/generate-image`: Proxies to OpenAI DALL-E 3 for cake image generation
  - Accepts `prompt` and optional `size` parameters
  - Handles both base64 and URL response formats from OpenAI
  - Returns base64-encoded images to avoid CORS issues
- `GET /api/health`: Simple health check endpoint

### Key Files

- `server.js`: Express server with OpenAI integration
- `cake-visualizer-ai.js`: Frontend logic for AI cake customization with Polish language support
- `scripts.js`: General frontend functionality (mobile menu, tabs)
- `index.html`: Main landing page
- `wizualizator-tortow.html`: AI cake visualizer page

### Environment Configuration

Requires `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Language Support

The application is primarily in Polish, with Polish labels and terminology throughout the cake visualizer interface.

### Static File Structure

- Blog posts in `blog/` directory
- Legal pages (privacy policy, terms, etc.) as separate HTML files
- Categorized cake images in `images/` subdirectories by occasion type