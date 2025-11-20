
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { topicAPI } from '../services/api'
import { showToast } from '../components/ToastContainer'

export default function TopicContent() {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTopicContent()
  }, [topicId])

  const fetchTopicContent = async () => {
    try {
      const response = await topicAPI.getContent(topicId)
      if (response.data.success) {
        setTopic(response.data.data.topic)
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load content', 'error')
      navigate(-1)
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
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>

        <Card className="topic-content-card">
          <h1>{topic?.title}</h1>
          <p className="topic-summary">{topic?.summary}</p>

          {topic?.video_url && (
            <div className="video-container">
              <div className="video-placeholder">
                <span>🎥</span>
                <p>Video: {topic.video_url}</p>
              </div>
            </div>
          )}

          {topic?.notes && (
            <div className="notes-content" dangerouslySetInnerHTML={{ __html: topic.notes }} />
          )}

          <div className="content-footer">
            <div className="pass-info">
              <span>Pass Mark: {topic?.pass_mark}%</span>
            </div>
            <button
              onClick={() => navigate(`/quiz/${topicId}`)}
              className="btn-primary btn-lg"
            >
              Take Quiz →
            </button>
          </div>
        </Card>
      </div>
    </>
  )
}