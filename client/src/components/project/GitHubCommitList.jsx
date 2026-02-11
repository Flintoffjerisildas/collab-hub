import React, { useEffect, useState } from 'react';
import githubService from '../../services/github.service';
import { toast } from 'react-toastify';
import { Loader2, GitCommit, ExternalLink, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const GitHubCommitList = ({ projectId }) => {
    const [commits, setCommits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                const data = await githubService.getCommits(projectId);
                setCommits(data);
            } catch (error) {
                toast.error('Failed to load commits');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchCommits();
        }
    }, [projectId]);

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (commits.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground">
                <GitCommit className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No commits found or repository not linked.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {commits.map((commit) => (
                <div key={commit.sha} className="p-4 rounded-lg bg-card/50 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                        {commit.author.avatar_url ? (
                            <img
                                src={commit.author.avatar_url}
                                alt={commit.author.name}
                                className="w-10 h-10 rounded-full border border-border"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={18} />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <a
                                href={commit.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:text-primary hover:underline line-clamp-1 block"
                            >
                                {commit.message}
                            </a>

                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {commit.author.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formatDistanceToNow(new Date(commit.author.date), { addSuffix: true })}
                                </span>
                                <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                    {commit.sha.substring(0, 7)}
                                </span>
                            </div>
                        </div>

                        <a
                            href={commit.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GitHubCommitList;
