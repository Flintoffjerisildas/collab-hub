import React, { useState, useEffect } from 'react';
import socketService from '../../services/socket.service';
import { Wifi, WifiOff } from 'lucide-react';

const SocketStatus = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');

    useEffect(() => {
        const checkStatus = () => {
            const socket = socketService.socket;
            if (socket) {
                setIsConnected(socket.connected);
                setTransport(socket.io?.engine?.transport?.name || 'N/A');
            } else {
                setIsConnected(false);
            }
        };

        // Check initially
        checkStatus();

        // Set up interval to check periodically (or use events if we exposed them)
        const interval = setInterval(checkStatus, 1000);

        // Also listen to events if possible, but we don't have a direct event emitter from service for status changes yet
        // We can hook into the socket instance directly if it exists
        const socket = socketService.socket;
        if (socket) {
            socket.on('connect', checkStatus);
            socket.on('disconnect', checkStatus);
            socket.io.engine.on("upgrade", () => checkStatus());
        }

        return () => {
            clearInterval(interval);
            if (socket) {
                socket.off('connect', checkStatus);
                socket.off('disconnect', checkStatus);
            }
        };
    }, []);

    if (!isConnected) {
        return (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 text-xs">
                <WifiOff size={14} />
                <span>Disconnected</span>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 z-50 text-xs opacity-50 hover:opacity-100 transition-opacity">
            <Wifi size={14} />
            <span>Connected ({transport})</span>
        </div>
    );
};

export default SocketStatus;
