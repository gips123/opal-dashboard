import { useEffect } from 'react';
import io from 'socket.io-client';
import { useIpalStore } from '@/store/useIpalStore';
import Cookies from 'js-cookie';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL as string;

export function useSocket() {
    const updateFromPayload = useIpalStore((s) => s.updateFromPayload);

    useEffect(() => {
        const token = Cookies.get('token');

        // Connect to websocket router
        const socket = io(SOCKET_URL, {
            auth: { token }, // Pass token if backend socket requires auth
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socket.on('connect', () => {
            console.log('Socket.IO connected', socket.id);
        });

        socket.on('newPayload', (data: any) => {
            // console.log('Realtime Payload Received:', data);
            updateFromPayload(data);
        });

        socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [updateFromPayload]);
}
