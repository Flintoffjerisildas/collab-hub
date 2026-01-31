import api from './api';

const getDashboardStats = async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
};

const getMyTasks = async () => {
    const response = await api.get('/dashboard/tasks');
    return response.data;
};

const dashboardService = {
    getDashboardStats,
    getMyTasks,
};

export default dashboardService;
