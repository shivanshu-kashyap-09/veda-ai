import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : undefined;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
