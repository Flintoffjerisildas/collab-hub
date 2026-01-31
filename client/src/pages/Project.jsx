import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../services/project.service';
import Button from '../components/common/Button';
import KanbanBoard from '../components/kanban/KanbanBoard';
import ChatDrawer from '../components/chat/ChatDrawer';
import AddMemberModal from '../components/project/AddMemberModal';
import NotificationDropdown from '../components/common/NotificationDropdown';
import { toast } from 'react-toastify';
import { ArrowLeft, MoreHorizontal, MessageSquare, UserPlus } from 'lucide-react';
import Alert from '../components/common/Alert';

const Project = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await projectService.getProjectById(id);
                setProject(data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load project');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id, navigate]);

    if (isLoading) {
        return <div className="p-10">Loading project...</div>;
    }

    if (!project) {
        return <div className="p-10">Project not found</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-muted/40">
            {/* Project Header */}
            <div className="flex items-center justify-between border-b bg-background px-6 py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{project.name}</h1>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationDropdown />
                    <Button variant="outline" size="sm" onClick={() => setIsChatOpen(!isChatOpen)}>
                        <MessageSquare size={16} className="mr-2" />
                        Chat
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAddMemberOpen(true)}>
                        <UserPlus size={16} className="mr-2" />
                        Add Member
                    </Button>
                    <Button variant="outline" size="sm">
                        Members ({project.members.length})
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal size={18} />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => setIsDeleteAlertOpen(true)}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Chat Drawer */}
            <ChatDrawer
                projectId={id}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />

            {/* Add Member Modal */}
            {isAddMemberOpen && (
                <AddMemberModal
                    projectId={id}
                    onClose={() => setIsAddMemberOpen(false)}
                />
            )}

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-hidden p-6">
                <KanbanBoard projectId={id} members={project.members} />
            </div>

            {isDeleteAlertOpen && (
                <Alert
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={async () => {
                        try {
                            await projectService.deleteProject(id);
                            toast.success('Project deleted');
                            navigate(`/workspace/${project.workspace}`);
                        } catch (error) {
                            setIsDeleteAlertOpen(false);
                            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                                toast.error('Only the project owner can delete this project.');
                            } else {
                                toast.error(error.response?.data?.message || 'Failed to delete project');
                            }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Project;
