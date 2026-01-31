import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const MyTasksWidget = ({ tasks }) => {
    const navigate = useNavigate();

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    return (
        <div className="h-full">

            <div className="p-2">
                {tasks.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                        <p>No pending tasks!</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md cursor-pointer group transition-colors"
                                onClick={() => task.project && navigate(`/project/${task.project._id}`)}
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <h4 className="font-medium text-sm truncate">{task.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {task.project ? task.project.name : 'Unknown Project'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                                    {task.dueDate && (
                                        <div className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-red-500 font-bold' : ''}`}>
                                            <Calendar size={12} />
                                            <span>{formatDate(task.dueDate)}</span>
                                        </div>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] bg-secondary border capitalize`}>
                                        {task.priority}
                                    </span>
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTasksWidget;
