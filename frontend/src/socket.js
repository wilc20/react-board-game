import { io } from 'socket.io-client';

const URL = 'http://localhost:8801';

const socket = io(URL, {
    reconnection: true,
    reconnectionDelay: 1000, // Minimum delay between reconnection attempts
    reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
    reconnectionAttempts: 10, 
    //reconnection: false,
    withCredentials: true,
    transports: ['websocket'],
    upgrade: false
});

export default socket;