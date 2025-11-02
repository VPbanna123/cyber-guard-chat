
// export default api;
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for cookies
});

// Store access token
let accessToken = localStorage.getItem('accessToken');

// Request interceptor - Add access token to headers
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Add token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          accessToken = response.data.accessToken;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`; //  Fixed space
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Helper to set access token
export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

// Helper to clear access token
export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
};

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'), //  Removed userId param
  refreshToken: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/auth/me'),
};

// User APIs
export const userAPI = {
  getAllUsers: () => api.get('/users/all'), //  Removed userId param - now from token
  searchUsers: (query) => api.get('/users/search', { params: { query } }), //  Removed userId
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
};

// Message APIs
export const messageAPI = {
  sendMessage: (data) => api.post('/messages/send', data),
  getMessages: (otherUserId, limit = 50, skip = 0) => 
    api.get('/messages/conversation', { params: { otherUserId, limit, skip } }), // Removed userId - from token
  getGroupMessages: (groupId, limit = 50, skip = 0) => 
    api.get('/messages/group', { params: { groupId, limit, skip } }),
  markAsRead: (messageId) => api.post('/messages/read', { messageId }), //  Removed userId - from token
  deleteMessage: (messageId) => api.delete('/messages/delete', { data: { messageId } }), //  Removed userId
  getRecentConversations: () => api.get('/messages/recent'), //  Removed userId - from token
};

// Group APIs
export const groupAPI = {
  createGroup: (data) => api.post('/groups/create', data),
  getUserGroups: () => api.get('/groups/user'), //  Removed userId - from token
  getGroupById: (id) => api.get(`/groups/${id}`),
  addMember: (data) => api.post('/groups/add-member', data),
  removeMember: (data) => api.post('/groups/remove-member', data),
  updateGroup: (data) => api.put('/groups/update', data),
  leaveGroup: (groupId) => api.post('/groups/leave', { groupId }), //  Removed userId - from token
deleteGroup: (groupId) => api.delete('/groups/delete', { data: { groupId } }),

};
// for alerting
export const alertAPI = {
  getAll: () => api.get('/alerts'),
  updateStatus: (alertId, status) => 
    api.patch(`/alerts/${alertId}/status`, { status }),
  getStats: () => api.get('/alerts/stats')
};

export default api;
