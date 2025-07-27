import api from './axios';

export const login = (data) => api.post('auth/login/', data);
export const signup = (data) => api.post('auth/register/', data);
export const getCurrentUser = () => api.get('auth/me/');
export const getProfile = (username) => api.get(`auth/profile/${username}/`);
export const updateProfile = (username, data) => api.patch(`auth/profile/${username}/`, data);
export const followUser = (id) => api.post(`auth/follow/${id}/`);
export const unfollowUser = (id) => api.delete(`auth/follow/${id}/`);
export const fetchSuggestedUsers = () => api.get('auth/suggested/');
