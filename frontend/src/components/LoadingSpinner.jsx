/**
 * Loading spinner component with optional message.
 */

import React from 'react'

const LoadingSpinner = ({ message = 'Loading students...' }) => {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="state-subtitle" style={{ marginTop: 16 }}>{message}</p>
    </div>
  )
}

export default LoadingSpinner
