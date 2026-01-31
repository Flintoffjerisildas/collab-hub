import { Link } from 'react-router-dom';
import { Calendar, CheckSquare } from 'lucide-react';
// import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
    return (
        <div className="block h-full">
            <div className="h-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-1.5 mb-2">
                    <div className="flex items-center justify-between">
                        <Link to={`/project/${project._id}`} className="hover:underline">
                            <h3 className="text-xl font-semibold leading-none tracking-tight">
                                {project.name}
                            </h3>
                        </Link>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {project.status}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || 'No description provided.'}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                    {/* <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : 'No date'}</span>
             </div> */}
                    <div className="flex items-center gap-1">
                        <CheckSquare size={14} />
                        <span>0 tasks</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
