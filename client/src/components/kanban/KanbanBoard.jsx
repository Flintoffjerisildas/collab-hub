import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, getProjectTasks } from '../../redux/slices/taskSlice';
import KanbanColumn from './KanbanColumn';
import CreateTaskModal from './CreateTaskModal';
import Button from '../common/Button';
import { Plus } from 'lucide-react';

const KanbanBoard = ({ projectId, members }) => {
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.task);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            dispatch(getProjectTasks(projectId));
        }
    }, [projectId, dispatch]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Optimistically update UI could be done here, 
        // but for now we'll just dispatch the API call.
        // Ideally we update local state immediately then sync.

        // We are changing status
        const newStatus = destination.droppableId;

        // TODO: Handle reordering within same column (requires 'order' field management on backend)
        // For now, we mainly handle status changes.

        dispatch(updateTask({
            id: draggableId,
            taskData: { status: newStatus }
        })).then(() => {
            // Refresh tasks to ensure order/state is synced
            dispatch(getProjectTasks(projectId));
        });
    };

    // Group tasks by status
    const columns = {
        'todo': tasks.filter(t => t.status === 'todo'),
        'in-progress': tasks.filter(t => t.status === 'in-progress'),
        'review': tasks.filter(t => t.status === 'review'),
        'done': tasks.filter(t => t.status === 'done'),
    };

    const columnOrder = ['todo', 'in-progress', 'review', 'done'];
    const columnTitles = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'review': 'Review',
        'done': 'Done'
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <Button size="sm" onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex h-full gap-4 pb-4 overflow-x-auto">
                    {columnOrder.map((colId) => (
                        <KanbanColumn
                            key={colId}
                            id={colId}
                            title={columnTitles[colId]}
                            tasks={columns[colId]}
                        />
                    ))}
                </div>
            </DragDropContext>

            {isModalOpen && (
                <CreateTaskModal
                    projectId={projectId}
                    members={members}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
