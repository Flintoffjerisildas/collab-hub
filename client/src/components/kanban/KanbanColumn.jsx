import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const KanbanColumn = ({ id, title, tasks }) => {
    return (
        <div className="w-80 flex-shrink-0 flex flex-col rounded-lg bg-muted/50 border h-full max-h-full">
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between border-b bg-muted/20">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground relative pl-3">
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full 
                    ${id === 'todo' ? 'bg-slate-400' :
                            id === 'in-progress' ? 'bg-blue-400' :
                                id === 'review' ? 'bg-yellow-400' : 'bg-green-400'}`}
                    />
                    {title}
                </h3>
                <span className="text-xs font-medium bg-background px-2 py-0.5 rounded border text-muted-foreground">
                    {tasks.length}
                </span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 p-3 overflow-y-auto min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task._id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
