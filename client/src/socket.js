import { io } from 'socket.io-client';

export const initSocket = async (namespace) => {
    const options = {
        forceNew: true,
        timeout: 60000,
        transports: ['websocket'],
    };
    return io(`${import.meta.env.VITE_SERVER_URL}/${namespace}`, options);
};
