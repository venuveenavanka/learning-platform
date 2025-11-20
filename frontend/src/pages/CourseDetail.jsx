import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { courseAPI } from '../services/api'
import { showToast } from '../components/ToastContainer'

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCourseTopics()
  }, [courseId])

  const fetchCourseTopics = async () => {
    try {
      const response = await courseAPI.getTopics(courseId)
      if (response.data.success) {
        setCourse(response.data.data.course)
        setTopics(response.data.data.topics)
      }
    } catch (error) {
      showToast('Failed to load course details', 'error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      completed: { text: 'Completed', class: 'badge-success' },
      unlocked: { text: 'Available', class: 'badge-primary' },
      in_progress: { text: 'In Progress', class: 'badge-warning' },
      locked: { text: 'Locked', class: 'badge-secondary' }
    }
    return badges[status] || badges.locked
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
        <button onClick={() => navigate('/courses')} className="btn-back">
          ← Back to Courses
        </button>

        <Card className="course-header-card">
          <h1>{course?.title}</h1>
          <p>{course?.description}</p>
          <div className="course-meta">
            <span>📚 {topics.length} Topics</span>
            <span>✅ {topics.filter(t => t.status === 'completed').length} Completed</span>
          </div>
        </Card>

        <div className="topics-list">
          {topics.map((topic, idx) => (
            <Card key={topic.id} className="topic-card">
              <div className="topic-number">{idx + 1}</div>
              
              <div className="topic-content">
                <div className="topic-header">
                  <h3>{topic.title}</h3>
                  <span className={`badge ${getStatusBadge(topic.status).class}`}>
                    {getStatusBadge(topic.status).text}
                  </span>
                </div>
                <p>{topic.summary}</p>
                
                {topic.best_score !== null && (
                  <div className="topic-stats">
                    <span>Best Score: {topic.best_score}%</span>
                    <span>Attempts: {topic.attempt_count}</span>
                    <span>Pass Mark: {topic.pass_mark}%</span>
                  </div>
                )}
              </div>
              
              <div className="topic-actions">
                {topic.is_unlocked && (
                  <>
                    <button
                      onClick={() => navigate(`/topics/${topic.id}`)}
                      className="btn-secondary"
                    >
                      View Content
                    </button>
                    <button
                      onClick={() => navigate(`/quiz/${topic.id}`)}
                      className="btn-primary"
                    >
                      {topic.status === 'completed' ? 'Retry Quiz' : 'Start Quiz'}
                    </button>
                  </>
                )}
                {!topic.is_unlocked && (
                  <span className="lock-icon">🔒</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
