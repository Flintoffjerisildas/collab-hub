import api from './api';

const githubService = {
    // Initiate GitHub Auth
    getAuthUrl: async () => {
        const response = await api.get('/github/auth');
        return response.data.url;
    },

    // Handle Callback
    handleCallback: async (code) => {
        const response = await api.post('/github/callback', { code });
        return response.data;
    },

    // Get User Repos
    getRepos: async () => {
        const response = await api.get('/github/repos');
        return response.data;
    },

    // Link Project
    linkProject: async (projectId, repoOwner, repoName) => {
        const response = await api.post(`/github/projects/${projectId}/link`, {
            repoOwner,
            repoName,
        });
        return response.data;
    },

    // Sync Issues
    syncIssues: async (projectId) => {
        const response = await api.post(`/github/projects/${projectId}/sync`);
        return response.data;
    },
};

export default githubService;
