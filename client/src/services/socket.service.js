import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class SocketService {
    socket;

    connect(options = {}) {
        this.socket = io(SOCKET_URL, {
            ...options,
            transports: ['websocket', 'polling'], // Try websocket first
            withCredentials: true,
            reconnectionAttempts: 5,
        });
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    joinProject(projectId) {
        if (this.socket) {
            this.socket.emit('join_project', projectId);
        }
    }

    leaveProject(projectId) {
        if (this.socket) {
            this.socket.emit('leave_project', projectId);
        }
    }

    sendMessage(messageData) {
        if (this.socket) {
            this.socket.emit('send_message', messageData);
        }
    }

    onReceiveMessage(callback) {
        if (this.socket) {
            this.socket.on('receive_message', callback);
        }
    }

    onNotification(callback) {
        if (this.socket) {
            this.socket.on('new_notification', callback);
        }
    }

    offReceiveMessage() {
        if (this.socket) {
            this.socket.off('receive_message');
        }
    }
}

const socketService = new SocketService();
export default socketService;
