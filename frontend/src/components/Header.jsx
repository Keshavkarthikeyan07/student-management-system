/**
 * Header component — sticky navigation bar with logo and student count
 */

import React from 'react'

const Header = ({ studentCount }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon" aria-hidden="true">🎓</div>
            <span className="logo-text">Student Management System</span>
          </div>

          <div className="header-stats" aria-label="Total students">
            <span>Total Students:</span>
            <strong>{studentCount}</strong>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
