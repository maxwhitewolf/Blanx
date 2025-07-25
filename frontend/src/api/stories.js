import api from './axios';

export const fetchStories = () => api.get('stories/');
export const uploadStory = (data) => api.post('stories/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const fetchStoryViewers = (id) => api.get(`stories/${id}/viewers/`);
export const reactToStory = (id, emoji) => api.post(`stories/${id}/reactions/`, { emoji });
export const commentOnStory = (id, content) => api.post(`stories/${id}/comments/`, { content }); 