import { Server as WebSocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: WebSocketServer;

export const initWebSocket = (server: HttpServer) => {
  io = new WebSocketServer(server, {
    cors: {
      origin: (origin: any, callback: any) => {
        if (!origin) return callback(null, true);
        if (origin.endsWith('.vercel.app') || origin.includes('localhost') || origin.includes('onrender.com')) {
          return callback(null, true);
        }
        callback(null, false);
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`Socket ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const broadcastToRoom = (room: string, event: string, payload: any) => {
  if (io) {
    io.to(room).emit(event, payload);
  } else {
    console.warn('Socket.io not initialized, cannot broadcast');
  }
};
