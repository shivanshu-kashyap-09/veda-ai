# Veda AI - Assessment Creator

Veda AI is an AI-powered assessment creator application that helps teachers generate customized question papers. The application consists of a React frontend and a Node.js/TypeScript backend with real-time updates via WebSocket.

## Project Structure

```
veda-ai/
├── veda-ai-frontend/     # React + Vite frontend application
├── veda-ai-backend/      # Node.js + Express backend API
└── README.md
```

## Prerequisites

For both frontend and backend:
- **Node.js** 18+ or compatible version
- **npm** (Node Package Manager)

For the backend:
- **MongoDB** instance (local or cloud)
- **Redis** instance (for job queue)

## Quick Start

### 1. Install Backend Dependencies
```bash
cd veda-ai-backend
npm install
```

### 2. Configure Backend Environment
Create a `.env` file in `veda-ai-backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vedaai
REDIS_URL=redis://127.0.0.1:6379
GROQ_API_KEY=YOUR_API_KEY
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Start Backend Server
```bash
npm run dev
```
The backend will be available at `http://localhost:5000`

### 4. Install Frontend Dependencies
In a new terminal, navigate to the frontend:
```bash
cd veda-ai-frontend
npm install
```

### 5. Configure Frontend Environment
Create a `.env` file in `veda-ai-frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

### 6. Start Frontend Development Server
```bash
npm run dev
```
The frontend will be available at the Vite dev server URL (typically `http://localhost:5173`)

## Backend

### Available Scripts
- `npm run dev` — Run in development mode with hot reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run the compiled production build

### Key Directories
- `src/config/` — Database and Redis configuration
- `src/controllers/` — Request handlers
- `src/routes/` — API route definitions
- `src/models/` — Mongoose schemas
- `src/queues/` — BullMQ worker for async tasks
- `src/websocket/` — Socket.IO integration

### API Endpoints
- `POST /api/assignments` — Create a new assignment
- `GET /api/assignments` — List all assignments
- `GET /api/assignments/:id` — Fetch assignment with generated paper
- `DELETE /api/assignments/:id` — Delete an assignment
- `GET /health` — Health check endpoint

## Frontend

### Available Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build locally

### Key Directories
- `src/pages/` — Page components (CreateAssignment, Output, Dashboard)
- `src/components/` — Reusable UI components
- `src/store/` — Zustand state management
- `src/api.js` — API client setup

### Features
- Create and manage assignments
- Real-time paper generation progress
- Download generated papers as PDF
- Responsive design with Tailwind CSS

## Technology Stack

### Frontend
- **React** 19 — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Zustand** — State management
- **Axios** — HTTP client
- **Socket.IO** — Real-time updates

### Backend
- **Express** — Web framework
- **TypeScript** — Type-safe development
- **Mongoose** — MongoDB ODM
- **BullMQ** — Job queue
- **Socket.IO** — Real-time communication
- **Groq API** — AI model for paper generation

## Notes

- Both `.env` files are excluded from version control (see `.gitignore`)
- The backend uses `ts-node-dev` during development for fast TypeScript compilation
- Frontend uses `html2canvas` and `jspdf` for PDF export
- WebSocket is used for real-time progress updates during paper generation

## Environment Variables

**Important:** Never commit `.env` files to the repository. Each developer should create their own `.env` file locally with the appropriate values.

- Backend `.env` — Contains API keys and database credentials
- Frontend `.env` — Contains the backend API URL

See individual README files in `veda-ai-backend/` and `veda-ai-frontend/` for detailed setup instructions.
