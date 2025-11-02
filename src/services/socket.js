
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initializeSocket = (userId) => {
  console.log('\n🔌 initializeSocket called with userId:', userId);
  
  // 🔥 FIX: Check if socket already exists AND is connected
  if (socket && socket.connected) {
    console.log('⚠️ Socket already connected, reusing existing connection');
    console.log('Current socket.id:', socket.id);
    console.log('Current userId:', userId);
    return socket;
  }

  // 🔥 FIX: If socket exists but disconnected, disconnect it first
  if (socket && !socket.connected) {
    console.log('🧹 Cleaning up old disconnected socket');
    socket.disconnect();
    socket = null;
  }

  console.log('✨ Creating new socket connection...');

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
  });

  socket.connect();

  socket.on('connect', () => {
    console.log(' Socket connected:', socket.id);
    console.log('📤 Emitting user:join with userId:', userId);
    socket.emit('user:join', userId);
    console.log(' user:join emitted\n');
  });

  socket.on('disconnect', () => {
    console.log(' Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error(' Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('🧹 Disconnecting socket');
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
};

