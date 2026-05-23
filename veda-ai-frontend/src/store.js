import { create } from 'zustand';

export const useStore = create((set) => ({
  assignment: null,
  setAssignment: (assignment) => set({ assignment }),
  
  status: 'idle',
  setStatus: (status) => set({ status }),
  
  error: null,
  setError: (error) => set({ error }),
}));
