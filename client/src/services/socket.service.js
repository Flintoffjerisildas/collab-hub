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
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach(callback => {
                if (this.socket && !this.socket.hasListeners(event)) {
                    this.socket.on(event, callback);
                } else if (this.socket) {
                    this.socket.on(event, callback);
                }
            });
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
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    _off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            if (callback) {
                callbacks.delete(callback);
                if (this.socket) {
                    this.socket.off(event, callback);
                }
            } else {
                callbacks.clear();
                if (this.socket) {
                    this.socket.off(event);
                }
            }
            if (callbacks.size === 0) {
                this.listeners.delete(event);
            }
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

    onTaskCreated(callback) {
        this._on('task_created', (data) => {
            console.log('SocketService: Received task_created', data);
            callback(data);
        });
    }

    onTaskUpdated(callback) {
        this._on('task_updated', (data) => {
            console.log('SocketService: Received task_updated', data);
            callback(data);
        });
    }

    onTaskDeleted(callback) {
        this._on('task_deleted', (data) => {
            console.log('SocketService: Received task_deleted', data);
            callback(data);
        });
    }

    onNewMessage(callback) {
        this._on('new_message', (data) => {
            console.log('SocketService: Received new_message', data);
            callback(data);
        });
    }

    onProjectCreated(callback) {
        this._on('project_created', callback);
    }

    onProjectDeleted(callback) {
        this._on('project_deleted', callback);
    }

    onNotification(callback) {
        this._on('new_notification', callback);
    }

    offReceiveMessage(callback) {
        this._off('receive_message', callback);
    }
}

const socketService = new SocketService();
export default socketService;
