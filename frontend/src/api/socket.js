const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8001';

export const createWebSocket = (path) => new WebSocket(`${SOCKET_URL}${path}`);

export default createWebSocket;
