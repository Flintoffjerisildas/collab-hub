import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';
import { Bell, Check } from 'lucide-react';

const NotificationDropdown = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector((state) => state.notification);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllAsRead());
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} className="text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border border-background"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-background shadow-lg z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                        <h4 className="font-semibold text-sm">Notifications</h4>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Check size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                <Bell className="mx-auto h-8 w-8 mb-2 opacity-20" />
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-3 text-sm hover:bg-muted/30 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''
                                            }`}
                                        onClick={() => handleMarkAsRead(notification._id)}
                                    >
                                        <p className="line-clamp-2 text-foreground/90">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                            {!notification.isRead && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
