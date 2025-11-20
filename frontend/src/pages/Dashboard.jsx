// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import Navbar from '../components/Navbar'
// import Card from '../components/Card'
// import { dashboardAPI, courseAPI } from '../services/api'
// import { showToast } from '../components/ToastContainer'

// export default function Dashboard() {
//   const [dashboard, setDashboard] = useState(null)
//   const [courses, setCourses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [dashRes, coursesRes] = await Promise.all([
//         dashboardAPI.getDashboard(),
//         courseAPI.getAll()
//       ])

//       if (dashRes.data.success) {
//         setDashboard(dashRes.data.data.dashboard)
//       }
//       if (coursesRes.data.success) {
//         setCourses(coursesRes.data.data.courses)
//       }
//     } catch (error) {
//       showToast('Failed to load dashboard', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="loading-screen">
//           <div className="spinner"></div>
//         </div>
//       </>
//     )
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="container">
//         <div className="page-header">
//           <h1>Dashboard</h1>
//           <p>Track your learning progress</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="stats-grid">
//           <Card className="stat-card">
//             <div className="stat-icon blue">📚</div>
//             <div className="stat-info">
//               <h3>{courses.length}</h3>
//               <p>Total Courses</p>
//             </div>
//           </Card>

//           <Card className="stat-card">
//             <div className="stat-icon green">✅</div>
//             <div className="stat-info">
//               <h3>{dashboard?.stats?.total_passed || 0}</h3>
//               <p>Quizzes Passed</p>
//             </div>
//           </Card>

//           <Card className="stat-card">
//             <div className="stat-icon purple">🎯</div>
//             <div className="stat-info">
//               <h3>{dashboard?.stats?.average_score || 0}%</h3>
//               <p>Average Score</p>
//             </div>
//           </Card>

//           <Card className="stat-card">
//             <div className="stat-icon orange">📝</div>
//             <div className="stat-info">
//               <h3>{dashboard?.stats?.total_attempts || 0}</h3>
//               <p>Total Attempts</p>
//             </div>
//           </Card>
//         </div>

//         {/* Courses Section */}
//         <section className="section">
//           <h2>Your Courses</h2>
//           <div className="courses-grid">
//             {courses.map(course => (
//               <Card 
//                 key={course.id}
//                 className="course-card"
//                 onClick={() => navigate(`/courses/${course.id}`)}
//               >
//                 <div className="course-icon">📖</div>
//                 <h3>{course.title}</h3>
//                 <p>{course.description}</p>
//                 <button className="btn-secondary">View Course →</button>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Recent Activity */}
//         {dashboard?.recent_activity && dashboard.recent_activity.length > 0 && (
//           <section className="section">
//             <h2>Recent Activity</h2>
//             <div className="activity-list">
//               {dashboard.recent_activity.map((activity, idx) => (
//                 <Card key={idx} className="activity-item">
//                   <div className="activity-icon">
//                     {activity.passed ? '✅' : '❌'}
//                   </div>
//                   <div className="activity-info">
//                     <h4>{activity.topic_title}</h4>
//                     <p>{activity.course_title}</p>
//                   </div>
//                   <div className="activity-score">
//                     <span className={activity.passed ? 'success' : 'danger'}>
//                       {activity.score_percent}%
//                     </span>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </>
//   )
// }


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { dashboardAPI } from '../services/api'
import { showToast } from '../components/ToastContainer'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await dashboardAPI.getDashboard()
      if (res.data.success) {
        const db = res.data.data.dashboard || {}
        // Normalize courses to a standardized shape expected by UI
        const normalizedCourses = (db.courses || []).map(c => ({
          id: c.course_id ?? c.id,
          title: c.course_title ?? c.title,
          description: c.course_description ?? c.description,
          progress_percent: c.progress_percent ?? 0,
          is_completed: !!c.is_completed,
          total_topics: c.total_topics ?? 0,
          completed_topics: c.completed_topics ?? 0
        }))

        setDashboard({ ...db, courses: normalizedCourses })
      } else {
        showToast(res.data.message || 'Failed to load dashboard', 'error')
      }
    } catch (error) {
      console.error(error)
      showToast('Failed to load dashboard', 'error')
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

  const courses = dashboard?.courses || []

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Track your learning progress</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon blue">📚</div>
            <div className="stat-info">
              <h3>{courses.length}</h3>
              <p>Courses</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <h3>{dashboard?.stats?.total_passed || 0}</h3>
              <p>Quizzes Passed</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon purple">🎯</div>
            <div className="stat-info">
              <h3>{dashboard?.stats?.average_score || 0}%</h3>
              <p>Average Score</p>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-icon orange">📝</div>
            <div className="stat-info">
              <h3>{dashboard?.stats?.total_attempts || 0}</h3>
              <p>Total Attempts</p>
            </div>
          </Card>
        </div>

        {/* Courses Section */}
        <section className="section">
          <h2>Your Courses <span className="course-icon">📖</span></h2>
          <div className="courses-grid">
            {courses.length === 0 && (
              <Card className="empty-card">
                <p>No course activity yet — start a quiz to see progress here.</p>
              </Card>
            )}

            {courses.map(course => (
              <Card
                key={course.id}
                className={`course-card ${course.is_completed ? 'completed-card' : ''}`}
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <div className="card-top">
                  <div className="course-meta">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-desc">{course.description}</p>
                    <div className="course-submeta">
                      <small>{course.completed_topics}/{course.total_topics} topics completed</small>
                    </div>
                  </div>

                  <div className="course-badge-wrap">
                    {course.is_completed ? (
                      <span className="completed-badge">Completed ✓</span>
                    ) : (
                      <span className="inprogress-badge">In Progress</span>
                    )}
                  </div>
                </div>

                <div className="course-progress">
                  <div className="progress-line" aria-hidden>
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress_percent}%` }}
                    />
                  </div>
                  <div className="progress-meta">
                    <small>{course.progress_percent}%</small>
                  </div>
                </div>

                <div className="course-actions">
                  <button
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/courses/${course.id}`)
                    }}
                  >
                    {course.is_completed ? 'Review Course' : 'View Course'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        {dashboard?.recent_activity && dashboard.recent_activity.length > 0 && (
          <section className="section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {dashboard.recent_activity.map((activity, idx) => (
                <Card key={idx} className="activity-item">
                  <div className="activity-icon">
                    {activity.passed ? '✅' : '❌'}
                  </div>
                  <div className="activity-info">
                    <h4>{activity.topic_title}</h4>
                    <p>{activity.course_title}</p>
                  </div>
                  <div className="activity-score">
                    <span className={activity.passed ? 'success' : 'danger'}>
                      {activity.score_percent}%
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
