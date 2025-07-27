import api from './axios';

export const getConversations = () => api.get('dm/conversations/');
export const createConversation = (userId) => api.post('dm/conversations/create/', { user_id: userId });
export const getMessages = (conversationId) => api.get(`dm/conversations/${conversationId}/messages/`);
export const sendMessage = (conversationId, content) => api.post(`dm/conversations/${conversationId}/messages/`, { content });
