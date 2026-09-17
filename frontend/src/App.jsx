/**
 * App.jsx — Root component.
 *
 * Manages:
 * - Global toast notification queue
 * - Student count for the header
 * - Layout: Header + main content
 */

import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ToastContainer from './components/Toast'

let toastIdCounter = 0

const App = () => {
  const [toasts, setToasts] = useState([])
  const [studentCount, setStudentCount] = useState(0)

  const showToast = useCallback((type, message) => {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <>
      <Header studentCount={studentCount} />

      <main className="main-content" id="main-content">
        <div className="container">
          <Dashboard
            onToast={showToast}
            onStudentCountChange={setStudentCount}
          />
        </div>
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

export default App
