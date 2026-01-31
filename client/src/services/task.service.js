import api from './api';

const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

const getProjectTasks = async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
};

const updateTask = async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
};

const deleteTask = async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
};

const taskService = {
    createTask,
    getProjectTasks,
    updateTask,
    deleteTask,
};

export default taskService;
