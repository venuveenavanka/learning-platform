import { useState, useEffect } from 'react'

let showToastFn = null

export function showToast(message, type = 'info') {
  if (showToastFn) {
    showToastFn(message, type)
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToastFn = (message, type) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 4000)
    }
  }, [])

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
