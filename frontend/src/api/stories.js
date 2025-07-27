import api from './axios';

export const fetchStories = () => api.get('stories/');
export const uploadStory = (data) => api.post('stories/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadStories = (files) => {
  const uploads = files.map(file => {
    const formData = new FormData();
    formData.append('media', file);
    return api.post('stories/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  });
  return Promise.all(uploads);
};
export const deleteStory = (id) => api.delete(`stories/${id}/`);
export const markStoryAsViewed = (id) => api.post(`stories/${id}/view/`);
export const fetchStoryViewers = (id) => api.get(`stories/${id}/viewers/`);
export const reactToStory = (id, emoji) => api.post(`stories/${id}/reactions/`, { emoji });
export const commentOnStory = (id, content) => api.post(`stories/${id}/comments/`, { content }); 
