import { Draggable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { deleteTask } from '../../redux/slices/taskSlice';
import { Calendar, Trash2, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Alert from '../common/Alert';

const TaskCard = ({ task, index }) => {
    const dispatch = useDispatch();
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const priorityColors = {
        low: 'bg-blue-100 text-blue-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };

    const handleDelete = () => {
        setIsDeleteAlertOpen(true);
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3 mb-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20 rotate-1' : ''
                        }`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex items-start justify-between mb-2">
                        <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${priorityColors[task.priority] || priorityColors.medium
                                }`}
                        >
                            {task.priority}
                        </span>
                        <button
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag start if possible, though handle is on parent usually
                                handleDelete();
                            }}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{task.name}</h4>

                    {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                        <div className="flex items-center text-xs text-muted-foreground">
                            {task.dueDate && (
                                <div className="flex items-center gap-1 mr-3">
                                    <Calendar size={12} />
                                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {task.assignee ? (
                            <div
                                className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary"
                                title={task.assignee.name}
                            >
                                {task.assignee.avatar ? (
                                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    task.assignee.name.charAt(0)
                                )}
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                <UserIcon size={12} className="text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    {isDeleteAlertOpen && (
                        <Alert
                            onClose={() => setIsDeleteAlertOpen(false)}
                            onConfirm={() => {
                                dispatch(deleteTask(task._id));
                                toast.success('Task deleted');
                                setIsDeleteAlertOpen(false);
                            }}
                        />
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
