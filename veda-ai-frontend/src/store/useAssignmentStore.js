import { create } from 'zustand';
import { io } from 'socket.io-client';

const DEFAULT_API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;

const DEFAULT_WS_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : undefined;
const WS_URL = import.meta.env.VITE_WS_URL || DEFAULT_WS_URL;

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
      if (!response.ok) throw new Error('Failed to fetch assignments');
      const data = await response.json();
      set({ assignments: data, isLoadingAssignments: false });
    } catch (error) {
      set({ error: error.message, isLoadingAssignments: false });
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
        throw new Error('Failed to create assignment');
      }

      const result = await response.json();
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
        const data = await response.json();
        if (data.paper) {
          set({ generatedPaper: data.paper, status: 'completed', progress: 100 });
        }
      }
    } catch (err) {
      console.error('Error fetching assignment result:', err);
    }
  },

  initWebSocket: (assignmentId) => {
    let socket = get().socket;
    
    if (!socket) {
      socket = io(WS_URL);
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
