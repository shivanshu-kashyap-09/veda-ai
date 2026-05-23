import { create } from 'zustand';
import { io } from 'socket.io-client';

const normalizeUrl = (url) => {
  if (!url) return url;
  if (url.startsWith('/') || /^https?:\/\//i.test(url)) {
    return url;
  }
  return `https://${url}`;
};

const API_BASE_URL = normalizeUrl(import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api`);
const WS_URL = normalizeUrl(import.meta.env.VITE_WS_URL || window.location.origin);

const parseJsonSafe = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON. Raw response:', text.substring(0, 200));
    throw new Error('Invalid JSON response from server');
  }
};

export const useAssignmentStore = create((set, get) => ({
  assignmentId: null,
  jobId: null,
  status: 'idle', // idle, generating, completed, failed
  progress: 0,
  generatedPaper: null,
  socket: null,
  error: null,
  assignments: [],
  isLoadingAssignments: false,

  fetchAssignments: async () => {
    set({ isLoadingAssignments: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`);
      if (!response.ok) throw new Error(`Failed to fetch assignments (${response.status})`);
      const data = await parseJsonSafe(response);
      set({ assignments: data || [], isLoadingAssignments: false });
    } catch (error) {
      console.error('fetchAssignments error:', error);
      set({ error: error.message, isLoadingAssignments: false, assignments: [] });
    }
  },

  deleteAssignment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete assignment');
      
      // Update local state by removing the deleted assignment
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id)
      }));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },

  createAssignment: async (data) => {
    set({ status: 'idle', error: null, progress: 0, generatedPaper: null });
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error (${response.status}): ${errText.substring(0, 100)}`);
      }

      const result = await parseJsonSafe(response);

      if (!result || !result.assignmentId) {
        throw new Error('Server returned empty or invalid response. Backend may not be deployed with latest code.');
      }

      set({ assignmentId: result.assignmentId, jobId: result.jobId, status: 'generating' });
      
      // Initialize WebSocket connection to listen for updates
      get().initWebSocket(result.assignmentId);
      
      return result.assignmentId;
    } catch (error) {
      set({ error: error.message, status: 'failed' });
      throw error;
    }
  },

  fetchAssignmentResult: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${id}`);
      if (response.ok) {
        const data = await parseJsonSafe(response);
        const statusFromBackend = data?.assignment?.status || (data?.paper ? 'completed' : undefined);
        if (data?.paper) {
          set({ generatedPaper: data.paper, status: 'completed', progress: 100 });
        } else if (statusFromBackend) {
          set({ status: statusFromBackend });
        }
      }
    } catch (err) {
      console.error('Error fetching assignment result:', err);
    }
  },

  initWebSocket: (assignmentId) => {
    let socket = get().socket;
    
    if (!socket) {
      socket = io(WS_URL, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });
      set({ socket });
    }

    socket.emit('join', assignmentId);

    socket.on('jobProgress', (data) => {
      set({ progress: data.progress, status: 'generating' });
    });

    socket.on('generationDone', (data) => {
      set({ progress: 100, status: 'completed', generatedPaper: data.paper });
    });

    socket.on('error', (data) => {
      set({ error: data.message, status: 'failed' });
    });
  },

  resetStore: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
    set({
      assignmentId: null,
      jobId: null,
      status: 'idle',
      progress: 0,
      generatedPaper: null,
      socket: null,
      error: null,
    });
  }
}));
