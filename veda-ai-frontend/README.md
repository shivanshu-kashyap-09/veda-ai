# Veda AI Frontend

This is the frontend for the Veda AI assessment creator app. It uses React, Vite, Tailwind CSS, and Zustand to present assignment data, generated question papers, and export the paper as a PDF.

## Setup

### Prerequisites
- Node.js 18+ or compatible version
- npm

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000
```

Adjust the `VITE_API_URL` to match your backend server address.

### Run the development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Notes
- The output paper page lives in `src/pages/Output.jsx`.
- API requests are handled through `src/api.js` and app state is managed in `src/store/useAssignmentStore.js`.

## Important files
- `src/main.jsx` — application entry point
- `src/App.jsx` — main routes and layout
- `src/pages/CreateAssignment.jsx` — assignment input page
- `src/pages/Output.jsx` — generated paper output and download functionality
- `src/store/useAssignmentStore.js` — Zustand global state for assignments

## Running with backend
The frontend expects the backend API to be available at the configured endpoint in `src/api.js`. Start the backend first, then open the frontend on the Vite development server.
