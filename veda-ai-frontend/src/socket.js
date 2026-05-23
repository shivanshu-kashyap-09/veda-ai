import { io } from 'socket.io-client';

const normalizeUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('/') || /^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
};

const DEFAULT_SOCKET_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://veda-ai-xcmp-5hv65rkd9-shivanshu-kashyap-09s-projects.vercel.app';

const SOCKET_URL = normalizeUrl(import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
