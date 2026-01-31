import api from './api';

const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

const getWorkspaceProjects = async (workspaceId) => {
    const response = await api.get(`/projects/workspace/${workspaceId}`);
    return response.data;
};

const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

const addMember = async (projectId, email) => {
    const response = await api.post(`/projects/${projectId}/members`, { email });
    return response.data;
};

// Delete project
// Delete project
const deleteProject = async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
};

const projectService = {
    createProject,
    getWorkspaceProjects,
    getProjectById,
    addMember,
    deleteProject
};

export default projectService;
