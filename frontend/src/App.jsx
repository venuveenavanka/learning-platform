import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/ToastContainer'

// Import Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import TopicContent from './pages/TopicContent'
import QuizStart from './pages/QuizStart'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/topics/:topicId" element={<ProtectedRoute><TopicContent /></ProtectedRoute>} />
          <Route path="/quiz/:topicId" element={<ProtectedRoute><QuizStart /></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
