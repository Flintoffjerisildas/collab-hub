import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectMessages, sendMessage, addMessage } from '../../redux/slices/chatSlice';
import socketService from '../../services/socket.service';
import Button from '../common/Button';
import Input from '../common/Input';
import { Send, X, MessageSquare } from 'lucide-react';

const ChatDrawer = ({ projectId, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { messages, isLoading } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && projectId) {
            // 1. Fetch historical messages
            dispatch(getProjectMessages(projectId));

            // 2. Connect socket and join room
            socketService.connect();
            socketService.joinProject(projectId);

            // 3. Listen for incoming messages
            socketService.onReceiveMessage((message) => {
                dispatch(addMessage(message));
                scrollToBottom();
            });
        }

        return () => {
            if (isOpen && projectId) {
                socketService.leaveProject(projectId);
                socketService.offReceiveMessage();
                // We typically don't disconnect the socket entirely if we want to reuse the connection,
                // but for this specific component lifecycle it's fine to leave the room.
            }
        };
    }, [isOpen, projectId, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic UI update could happen here, but for now we wait for API
        const messageData = {
            content: newMessage,
            projectId,
        };

        // Send to API (which saves to DB)
        // We also emit to socket from here OR let the backend do it.
        // In our backend implementation:
        // messageController saves to DB.
        // We should probably emit via socket from client if backend doesn't auto-emit on HTTP post,
        // OR rely on the HTTP response + socket for others.
        //
        // Current Backend Logic:
        // Controller `sendMessage`: Saves to DB, returns JSON. DOES NOT emit socket.
        // Server `socket.on('send_message')`: Broadcasts to OTHERS.
        //
        // So the flow should be:
        // 1. Client calls API to save message.
        // 2. Client on success:
        //    a) Dispatches addMessage (for self).
        //    b) Emits 'send_message' (for others).

        try {
            // 1. Save to DB
            const result = await dispatch(sendMessage(messageData)).unwrap();

            // 2. Emit to others via Socket
            socketService.sendMessage(result);

            // 3. Add to our own list (already done by getProjectMessages? No, we need to add explicitly or refetch)
            // The extraReducer for sendMessage handles adding it to state, so we are good there.

            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-1/3 bg-background border-l shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/40">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <h3 className="font-semibold">Project Chat</h3>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {isLoading && messages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-10 opacity-70">
                        <MessageSquare className="mx-auto mb-2 opacity-50" />
                        No messages yet. Say hi!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwnMessage = msg.sender._id === user._id;
                        return (
                            <div
                                key={msg._id}
                                className={`flex flex-col max-w-full ${isOwnMessage ? 'self-end items-end' : 'self-start items-start'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {!isOwnMessage && (
                                        <span className="text-[10px] font-bold text-muted-foreground">
                                            {msg.sender.name}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`px-3 py-2 rounded-lg text-sm ${isOwnMessage
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-secondary text-secondary-foreground rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-0.5 opacity-70">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send size={18} />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatDrawer;
