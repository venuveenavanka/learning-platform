// ==============================================
// Purpose: Axios configuration and API endpoints
// ==============================================
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// AUTH API ENDPOINTS
// ============================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
}

// ============================================
// COURSE API ENDPOINTS
// ============================================
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getTopics: (id) => api.get(`/courses/${id}/topics`)
}

// ============================================
// TOPIC API ENDPOINTS
// ============================================
export const topicAPI = {
  getContent: (id) => api.get(`/topics/${id}/content`)
}

// ============================================
// QUIZ API ENDPOINTS
// ============================================
export const quizAPI = {
  start: (topicId) => api.post('/quizzes/start', { topicId }),
  submit: (topicId, answers) => api.post('/quizzes/submit', { topicId, answers })
}

// ============================================
// DASHBOARD API ENDPOINTS
// ============================================
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getProgress: (courseId) => api.get(`/dashboard/progress/${courseId}`)
}

export default api