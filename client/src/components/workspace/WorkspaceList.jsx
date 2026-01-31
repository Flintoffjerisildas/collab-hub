import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaces, reset } from '../../redux/slices/workspaceSlice';
import { toast } from 'react-toastify';
import WorkspaceCard from './WorkspaceCard';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import Button from '../common/Button';
import { Plus } from 'lucide-react';

const WorkspaceList = () => {
    const dispatch = useDispatch();
    const { workspaces, isLoading, isError, message } = useSelector(
        (state) => state.workspace
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        dispatch(getWorkspaces());

        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch]);

    if (isLoading) {
        return <div className="text-center py-10">Loading workspaces...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Your Workspaces</h2>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Workspace
                </Button>
            </div>

            {workspaces.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {workspaces.map((workspace) => (
                        <WorkspaceCard key={workspace._id} workspace={workspace} />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                    <h3 className="text-lg font-medium">No workspaces found</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Get started by creating your first workspace.
                    </p>
                    <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                        Create Workspace
                    </Button>
                </div>
            )}

            {isModalOpen && <CreateWorkspaceModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default WorkspaceList;
