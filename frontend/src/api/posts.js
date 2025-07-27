import api from './axios';

export const fetchFeed = () => api.get('posts/feed/');
export const fetchPosts = () => api.get('posts/');
export const fetchUserPosts = (username) => api.get(`posts/user/${username}/`);
export const createPost = (data) => api.post('posts/', data);
export const likePost = (id) => api.post(`posts/${id}/like/`);
export const unlikePost = (id) => api.delete(`posts/${id}/like/`);
export const addComment = (postId, data) => api.post(`posts/${postId}/comments/`, data);
export const fetchLikedPosts = () => api.get('posts/liked/');
