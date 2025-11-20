import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { courseAPI } from '../services/api'
import { showToast } from '../components/ToastContainer'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll()
      if (response.data.success) {
        setCourses(response.data.data.courses)
      }
    } catch (error) {
      showToast('Failed to load courses', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-screen">
          <div className="spinner"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>All Courses</h1>
          <p>Choose a course to start learning</p>
        </div>

        <div className="courses-grid">
          {courses.map(course => (
            <Card 
              key={course.id}
              className="course-card hover-lift"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="course-icon">📖</div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button className="btn-primary mt-auto">
                Start Learning →
              </button>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}