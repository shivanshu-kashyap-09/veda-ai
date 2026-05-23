# Veda AI Backend

This backend powers the Veda AI assessment creator application. It provides API endpoints to create assignments, generate question papers, and serve generated output.

## Setup

### Prerequisites
- Node.js 18+ or compatible version
- npm
- MongoDB instance
- Redis instance

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env` file in `veda-ai-backend/` 

Example `.env` values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vedaai
REDIS_URL=redis://127.0.0.1:6379
GROQ_API_KEY=YOUR_API_KEY
GROQ_MODEL=llama-3.3-70b-versatile
```

### Run in development
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Start the built server
```bash
npm start
```

## Key folders
- `src/config/` — database and Redis configuration
- `src/controllers/` — request handlers for assignments and paper generation
- `src/routes/` — Express route definitions
- `src/models/` — Mongoose schemas for assignments and generated papers
- `src/queues/` — BullMQ queue worker setup for paper generation
- `src/websocket/` — Socket.IO server integration for real-time updates

## API endpoints
- `POST /api/assignments` — create a new assignment request
- `GET /api/assignments` — list assignments
- `GET /api/assignments/:id` — fetch a specific assignment with generated paper
- `DELETE /api/assignments/:id` — delete an assignment
- `GET /health` — health check endpoint

## Notes
- The backend uses `ts-node-dev` for fast TypeScript development during `npm run dev`.
- `npm run build` compiles TypeScript into `dist/`, and `npm start` runs the compiled output.
- A **keep-alive cron job** runs every 5 minutes to ping the `/health` endpoint, keeping the backend active and preventing it from going to sleep (especially useful on cloud platforms like Heroku).
