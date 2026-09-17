/**
 * Toast notification component.
 * Displays success, error and info messages.
 * Auto-dismisses after 4 seconds.
 */

import React, { useEffect, useState } from 'react'

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
}

const Toast = ({ id, type = 'info', message, onClose }) => {
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setRemoving(true)
    setTimeout(() => onClose(id), 300)
  }

  return (
    <div
      className={`toast ${type} ${removing ? 'removing' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="toast-icon" aria-hidden="true">{TOAST_ICONS[type]}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  )
}

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}

export default ToastContainer
