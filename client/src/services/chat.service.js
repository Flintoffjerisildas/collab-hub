import api from './api';

const getProjectMessages = async (projectId) => {
    const response = await api.get(`/messages/${projectId}`);
    return response.data;
};

const sendMessage = async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
};

const chatService = {
    getProjectMessages,
    sendMessage,
};

export default chatService;
