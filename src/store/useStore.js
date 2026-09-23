import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // User role ('user', 'groupAdmin', 'superAdmin')
  role: 'user',
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
