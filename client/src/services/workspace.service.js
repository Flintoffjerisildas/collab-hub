import api from './api';

const createWorkspace = async (workspaceData) => {
    const response = await api.post('/workspaces', workspaceData);
    return response.data;
};

const getWorkspaces = async () => {
    const response = await api.get('/workspaces');
    return response.data;
};

const getWorkspaceById = async (id) => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
}

// Delete workspace
const deleteWorkspace = async (workspaceId) => {
    const response = await api.delete(`/workspaces/${workspaceId}`);
    return response.data;
};

const workspaceService = {
    createWorkspace,
    getWorkspaces,
    getWorkspaceById,
    deleteWorkspace
};

export default workspaceService;
