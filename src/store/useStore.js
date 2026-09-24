import { create } from 'zustand';

// Safely read initial auth from localStorage
const getSavedAuth = () => {
  try {
    const raw = localStorage.getItem('cologuri_admin_session');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const initialAuth = getSavedAuth();

export const useStore = create((set, get) => ({
  // Auth state
  currentUser: initialAuth,
  role: initialAuth?.role || null, // 'groupAdmin' | 'superAdmin' | null
  
  login: (userData) => {
    try {
      localStorage.setItem('cologuri_admin_session', JSON.stringify(userData));
    } catch (e) {}
    set({ currentUser: userData, role: userData.role });
  },

  logout: () => {
    try {
      localStorage.removeItem('cologuri_admin_session');
    } catch (e) {}
    set({ currentUser: null, role: null });
  },

  setRole: (role) => set({ role }),

  // View routing state (for backwards-compatible seamless view switcher)
  userView: 'home', // 'home' | 'searchResults' | 'tourDetails'
  setUserView: (userView) => set({ userView }),

  selectedTourId: 'sajek-1',
  setSelectedTourId: (selectedTourId) => set({ selectedTourId }),

  returnView: 'home',
  setReturnView: (returnView) => set({ returnView }),

  // Search parameters
  searchQuery: {
    destination: 'sajek',
    date: '2026-10-28',
    guests: '2',
  },
  setSearchQuery: (query) => set({ searchQuery: { ...get().searchQuery, ...query } }),

  // Real-time seat locking state { [tourId]: string[] of locked seats }
  lockedSeats: {},
  setLockedSeats: (tourId, seats) =>
    set((state) => ({
      lockedSeats: { ...state.lockedSeats, [tourId]: seats },
    })),
  addLockedSeat: (tourId, seatNumber) =>
    set((state) => {
      const current = state.lockedSeats[tourId] || [];
      if (current.includes(seatNumber)) return state;
      return {
        lockedSeats: {
          ...state.lockedSeats,
          [tourId]: [...current, seatNumber],
        },
      };
    }),
  removeLockedSeat: (tourId, seatNumber) =>
    set((state) => {
      const current = state.lockedSeats[tourId] || [];
      return {
        lockedSeats: {
          ...state.lockedSeats,
          [tourId]: current.filter((s) => s !== seatNumber),
        },
      };
    }),

  // Current user booking session
  currentBooking: {
    tourId: null,
    seats: [],
    customerName: '',
    phone: '',
    emergencyContact: '',
    paymentMethod: 'bKash',
  },
  setCurrentBooking: (booking) =>
    set((state) => ({ currentBooking: { ...state.currentBooking, ...booking } })),
  clearCurrentBooking: () =>
    set({
      currentBooking: {
        tourId: null,
        seats: [],
        customerName: '',
        phone: '',
        emergencyContact: '',
        paymentMethod: 'bKash',
      },
    }),
}));
