import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import githubService from '../../services/github.service';
import { Github, Loader2, RefreshCw, Link as LinkIcon } from 'lucide-react';

const GitHubSettingsModal = ({ project, onClose, onUpdate }) => {
    const { user } = useSelector((state) => state.auth);
    const [repos, setRepos] = useState([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState(null);

    useEffect(() => {
        if (user?.githubUsername && !project.githubRepoName) {
            fetchRepos();
        }
    }, [user, project]);

    const fetchRepos = async () => {
        setIsLoadingRepos(true);
        try {
            const data = await githubService.getRepos();
            setRepos(data);
        } catch (error) {
            toast.error('Failed to load repositories');
        } finally {
            setIsLoadingRepos(false);
        }
    };

    const handleLinkRepo = async () => {
        if (!selectedRepo) return;

        // Parse selectedRepo which might be a JSON string or object
        const repo = JSON.parse(selectedRepo);

        try {
            const updatedProject = await githubService.linkProject(project._id, repo.owner, repo.name);
            toast.success('Project linked to GitHub repository');
            onUpdate(updatedProject);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to link repository');
        }
    };

    const handleSyncIssues = async () => {
        setIsSyncing(true);
        try {
            const result = await githubService.syncIssues(project._id);
            toast.success(result.message);
            // Ideally trigger a refresh of tasks
            if (onUpdate) onUpdate(project); // Just to maybe trigger re-render or we might need to reload tasks
            window.location.reload(); // Simple way to refresh tasks
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to sync issues');
        } finally {
            setIsSyncing(false);
        }
    };

    if (!user?.githubUsername) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg border">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Github size={24} /> GitHub Integration
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                        You need to connect your GitHub account to your profile before you can link repositories.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                        <Button onClick={() => window.location.href = '/profile'}>Go to Profile</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg border">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Github size={24} /> GitHub Integration
                </h2>

                {project.githubRepoName ? (
                    <div className="space-y-4">
                        <div className="p-4 rounded-md bg-muted/50 border">
                            <p className="text-sm font-medium text-muted-foreground">Linked Repository</p>
                            <p className="text-lg font-semibold flex items-center gap-2">
                                <LinkIcon size={16} />
                                {project.githubRepoOwner}/{project.githubRepoName}
                            </p>
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleSyncIssues}
                            disabled={isSyncing}
                        >
                            {isSyncing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Syncing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" /> Sync Issues
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Select a repository to link to this project. This will allow you to sync issues as tasks.
                        </p>

                        {isLoadingRepos ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Repository</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={(e) => setSelectedRepo(e.target.value)}
                                    value={selectedRepo || ''}
                                >
                                    <option value="">Select a repository</option>
                                    {repos.map((repo) => (
                                        <option key={repo.id} value={JSON.stringify({ owner: repo.owner, name: repo.name })}>
                                            {repo.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <Button
                            className="w-full"
                            onClick={handleLinkRepo}
                            disabled={!selectedRepo}
                        >
                            Link Repository
                        </Button>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <Button variant="ghost" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default GitHubSettingsModal;
