import api from './axios';

export const fetchFeed = () => api.get('posts/feed/');
export const fetchPosts = () => api.get('posts/');
export const fetchUserPosts = (username) => api.get(`posts/user/${username}/`);
export const createPost = (data) => api.post('posts/', data);
export const likePost = (id) => api.post(`posts/${id}/like/`);
// The backend toggles like status via a POST request. Use the same
// endpoint with POST for unliking to keep the client in sync.
export const unlikePost = (id) => api.post(`posts/${id}/like/`);
export const addComment = (postId, data) => api.post(`posts/${postId}/comments/`, data); 