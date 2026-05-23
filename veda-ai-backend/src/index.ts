import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { connectDB } from './config/db';
import assignmentRoutes from './routes/assignment.routes';
import { initWebSocket } from './websocket/socketServer';
import { initWorker } from './queues/worker';

const corsOptions = {
  origin: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    if (req.headers['access-control-request-private-network']) {
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());

app.use('/api/assignments', assignmentRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const server = http.createServer(app);

initWebSocket(server);

const PORT = process.env.PORT || 5000;

const initKeepAlive = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/health`);
      if (response.ok) {
        console.log(`[${new Date().toISOString()}] Keep-alive ping successful`);
      }
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  });
  console.log('Keep-alive cron job initialized (runs every 5 minutes)');
};

const startServer = async () => {
  await connectDB();

  initWorker();
  console.log('BullMQ worker initialized');

  initKeepAlive();

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
