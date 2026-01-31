import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkspaceProjects } from '../../redux/slices/projectSlice';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import Button from '../common/Button';
import { Plus } from 'lucide-react';

const ProjectList = ({ workspaceId }) => {
    const dispatch = useDispatch();
    const { projects, isLoading } = useSelector((state) => state.project);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (workspaceId) {
            dispatch(getWorkspaceProjects(workspaceId));
        }
    }, [workspaceId, dispatch]);

    if (isLoading) {
        return <div>Loading projects...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            {projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {projects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">No projects found. Create one to get started.</p>
            )}

            {isModalOpen && (
                <CreateProjectModal
                    workspaceId={workspaceId}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectList;
