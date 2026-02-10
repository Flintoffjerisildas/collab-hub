import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class SocketService {
    socket = null;
    pendingEmits = [];
    listeners = new Map();

    connect(options = {}) {
        if (this.socket && this.socket.connected) return this.socket;

        this.socket = io(SOCKET_URL, {
            ...options,
            transports: ['websocket', 'polling'],
            withCredentials: true,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('Socket Connected:', this.socket.id);
            this._processPendingActions();
        });

        this.socket.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err);
        });

        // Re-attach listeners if they exist
        this.listeners.forEach((callback, event) => {
            if (!this.socket.hasListeners(event)) {
                this.socket.on(event, callback);
            }
        });

        return this.socket;
    }

    _processPendingActions() {
        if (!this.socket) return;

        // Process pending emits
        while (this.pendingEmits.length > 0) {
            const { event, data } = this.pendingEmits.shift();
            this.socket.emit(event, data);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.pendingEmits = [];
        this.listeners.clear();
    }

    _emit(event, data) {
        if (this.socket && this.socket.connected) {
            this.socket.emit(event, data);
        } else {
            this.pendingEmits.push({ event, data });
        }
    }

    _on(event, callback) {
        this.listeners.set(event, callback);
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    _off(event) {
        this.listeners.delete(event);
        if (this.socket) {
            this.socket.off(event);
        }
    }

    joinProject(projectId) {
        this._emit('join_project', projectId);
    }

    leaveProject(projectId) {
        this._emit('leave_project', projectId);
    }

    joinWorkspace(workspaceId) {
        this._emit('join_workspace', workspaceId);
    }

    leaveWorkspace(workspaceId) {
        this._emit('leave_workspace', workspaceId);
    }

    sendMessage(messageData) {
        this._emit('send_message', messageData);
    }

    onReceiveMessage(callback) {
        this._on('receive_message', callback);
    }

    onNotification(callback) {
        this._on('new_notification', callback);
    }

    offReceiveMessage() {
        this._off('receive_message');
    }
}

const socketService = new SocketService();
export default socketService;
