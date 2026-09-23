import { io } from 'socket.io-client';
import { useStore } from '../store/useStore';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  socket = io(serverUrl, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    // Connected to realtime server
  });

  socket.on('seats:updated', ({ tourId, lockedSeats }) => {
    useStore.getState().setLockedSeats(tourId, lockedSeats);
  });

  socket.on('seat:locked', ({ tourId, seatNumber }) => {
    useStore.getState().addLockedSeat(tourId, seatNumber);
  });

  socket.on('seat:released', ({ tourId, seatNumber }) => {
    useStore.getState().removeLockedSeat(tourId, seatNumber);
  });

  return socket;
};

export const getSocket = () => socket || initSocket();

export const emitLockSeat = (tourId, seatNumber, userId) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('seat:lock', { tourId, seatNumber, userId });
  }
};

export const emitReleaseSeat = (tourId, seatNumber, userId) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('seat:release', { tourId, seatNumber, userId });
  }
};
