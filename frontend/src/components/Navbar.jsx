// // ============================================
// // FILE: src/components/Navbar.jsx (UPDATED WITH PROFILE POPUP)
// // ============================================
// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useAuth } from '../auth/useAuth'

// export default function Navbar() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

//   const handleLogoutClick = () => {
//     setShowProfileMenu(false)
//     setShowLogoutConfirm(true)
//   }

//   const confirmLogout = () => {
//     logout()
//     setShowLogoutConfirm(false)
//     navigate('/login')
//   }

//   const cancelLogout = () => {
//     setShowLogoutConfirm(false)
//   }

//   return (
//     <>
//       <nav className="navbar">
//         <div className="nav-container">
//           <Link to="/" className="nav-logo">
//             <span className="logo-icon">🎓</span>
//             <span className="logo-text">LearnHub</span>
//           </Link>

//           <div className="nav-links">
//             <Link to="/dashboard" className="nav-link">Dashboard</Link>
//             <Link to="/courses" className="nav-link">Courses</Link>
//           </div>

//           <div className="nav-user">
//             <div 
//               className="user-profile-trigger"
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//             >
//               <div className="user-avatar">
//                 {user?.full_name?.[0]?.toUpperCase() || 'U'}
//               </div>
//               <span className="user-name">{user?.full_name}</span>
//               <svg 
//                 className={`dropdown-icon ${showProfileMenu ? 'rotate' : ''}`}
//                 width="20" 
//                 height="20" 
//                 viewBox="0 0 20 20" 
//                 fill="currentColor"
//               >
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>

//             {/* Profile Dropdown Menu */}
//             {showProfileMenu && (
//               <>
//                 <div 
//                   className="profile-menu-overlay"
//                   onClick={() => setShowProfileMenu(false)}
//                 />
//                 <div className="profile-menu">
//                   <div className="profile-menu-header">
//                     <div className="profile-avatar-large">
//                       {user?.full_name?.[0]?.toUpperCase() || 'U'}
//                     </div>
//                     <div className="profile-info">
//                       <h3>{user?.full_name}</h3>
//                       <p>{user?.email}</p>
//                     </div>
//                   </div>

//                   <div className="profile-menu-divider"></div>

//                   <div className="profile-menu-items">
//                     <Link 
//                       to="/dashboard" 
//                       className="profile-menu-item"
//                       onClick={() => setShowProfileMenu(false)}
//                     >
//                       <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                       </svg>
//                       <span>Dashboard</span>
//                     </Link>

//                     <Link 
//                       to="/courses" 
//                       className="profile-menu-item"
//                       onClick={() => setShowProfileMenu(false)}
//                     >
//                       <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
//                       </svg>
//                       <span>My Courses</span>
//                     </Link>

//                     <div className="profile-menu-divider"></div>

//                     <button 
//                       className="profile-menu-item logout-item"
//                       onClick={handleLogoutClick}
//                     >
//                       <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
//                       </svg>
//                       <span>Logout</span>
//                     </button>
//                   </div>

//                   <div className="profile-menu-footer">
//                     <span className="profile-menu-version">Version 1.0.0</span>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <>
//           <div className="modal-overlay" onClick={cancelLogout} />
//           <div className="modal logout-modal">
//             <div className="modal-content">
//               <div className="modal-icon logout-icon">
//                 <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <h2>Confirm Logout</h2>
//               <p>Are you sure you want to logout from your account?</p>
//               <div className="modal-actions">
//                 <button onClick={cancelLogout} className="btn-secondary">
//                   Cancel
//                 </button>
//                 <button onClick={confirmLogout} className="btn-danger">
//                   Yes, Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   )
// }


import { useState } from 'react'
import { Link,useLocation , useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export default function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth()
  
  const { isDark, toggleTheme } = useTheme()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogoutClick = () => {
    setShowProfileMenu(false)
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
    navigate('/login')
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LearnHub</span>
          </Link>

          <div className="nav-links">
            
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/courses" className={`nav-link ${location.pathname.startsWith('/courses') ? 'active' : ''}`}>Courses</Link>
          </div>

          <div className="nav-user">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                <div className="toggle-thumb">
                  {isDark ? (
                    <Moon className="toggle-icon" size={14} />
                  ) : (
                    <Sun className="toggle-icon" size={14} />
                  )}
                </div>
              </div>
            </button>

            <div 
              className="user-profile-trigger"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="user-avatar">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.full_name}</span>
              <svg 
                className={`dropdown-icon ${showProfileMenu ? 'rotate' : ''}`}
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <>
                <div 
                  className="profile-menu-overlay"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="profile-menu">
                  <div className="profile-menu-header">
                    <div className="profile-avatar-large">
                      {user?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="profile-info">
                      <h3>{user?.full_name}</h3>
                      <p>{user?.email}</p>
                    </div>
                  </div>

                  <div className="profile-menu-divider"></div>

                  <div className="profile-menu-items">
                    <Link 
                      to="/dashboard" 
                      className="profile-menu-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>

                    <Link 
                      to="/courses" 
                      className="profile-menu-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                      <span>My Courses</span>
                    </Link>

                    <div className="profile-menu-divider"></div>

                    <button 
                      className="profile-menu-item logout-item"
                      onClick={handleLogoutClick}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>

                  <div className="profile-menu-footer">
                    <span className="profile-menu-version">Version 1.0.0</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div className="modal-overlay" onClick={cancelLogout} />
          <div className="modal logout-modal">
            <div className="modal-content">
              <div className="modal-icon logout-icon">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h2>Confirm Logout</h2>
              <p>Are you sure you want to logout from your account?</p>
              <div className="modal-actions">
                <button onClick={cancelLogout} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={confirmLogout} className="btn-danger">
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}