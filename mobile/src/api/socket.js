import { io } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'ws://localhost:8001';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export default socket;
