import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { socketUpdateProject } from '../redux/slices/projectSlice';
import socketService from '../services/socket.service';
import { useParams, useNavigate } from 'react-router-dom';
import workspaceService from '../services/workspace.service';
import Button from '../components/common/Button';
import ProjectList from '../components/project/ProjectList';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import Alert from '../components/common/Alert';

import { useDispatch } from 'react-redux';
import { socketUpdateProject } from '../redux/slices/projectSlice';
import socketService from '../services/socket.service';

const Workspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [workspace, setWorkspace] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const data = await workspaceService.getWorkspaceById(id);
                setWorkspace(data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load workspace');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspace();

        // Join workspace room for real-time updates
        if (id) {
            socketService.joinWorkspace(id);
            socketService.onReceiveMessage((data) => {
                if (data.type && data.type.startsWith('PROJECT_')) {
                    dispatch(socketUpdateProject(data));
                }
            });
        }

        return () => {
            if (id) {
                socketService.leaveWorkspace(id);
                socketService.offReceiveMessage();
            }
        }
    }, [id, navigate, dispatch]);

    if (isLoading) {
        return <div className="p-10">Loading workspace...</div>;
    }

    if (!workspace) {
        return <div className="p-10">Workspace not found</div>;
    }

    return (
        <div className="container mx-auto p-10">
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{workspace.name}</h1>
                    <p className="text-muted-foreground mt-1">{workspace.description}</p>
                </div>
                <div>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => setIsDeleteAlertOpen(true)}
                    >
                        Delete Workspace
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Projects List with Create Modal inside it */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <ProjectList workspaceId={id} />
                </div>

                {/* Members List will go here */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Members</h2>
                    <ul className="space-y-4">
                        {workspace.members.map((member) => (
                            <li key={member._id} className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {member.user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{member.user.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isDeleteAlertOpen && (
                <Alert
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={async () => {
                        try {
                            await workspaceService.deleteWorkspace(id);
                            toast.success('Workspace deleted');
                            navigate('/');
                        } catch (error) {
                            setIsDeleteAlertOpen(false);
                            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                                toast.error('Only the workspace owner can delete this workspace.');
                            } else {
                                toast.error(error.response?.data?.message || 'Failed to delete workspace');
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Workspace;
