import { Link } from 'react-router-dom';
import { Users, FolderGit2 } from 'lucide-react';

const WorkspaceCard = ({ workspace }) => {
    return (
        <Link to={`/workspace/${workspace._id}`} className="block">
            <div className="h-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                            {workspace.name}
                        </h3>
                        <span className="text-xs text-muted-foreground border px-2 py-1 rounded-full">
                            {workspace.members.length} member{workspace.members.length !== 1 && 's'}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {workspace.description || 'No description provided.'}
                    </p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{workspace.members.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FolderGit2 size={16} />
                        <span>{workspace.projects?.length || 0} projects</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default WorkspaceCard;
