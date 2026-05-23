import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import assignmentRoutes from './routes/assignment.routes';
import { initWebSocket } from './websocket/socketServer';
import { initWorker } from './queues/worker';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/assignments', assignmentRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const server = http.createServer(app);

initWebSocket(server);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  initWorker();
  console.log('BullMQ worker initialized');

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
