/**
 * StudentTable component.
 *
 * Displays list of students with:
 * - All columns: ID, Name, Email, Phone, Department, Year, Actions
 * - Edit and Delete buttons per row
 * - Loading, empty, and error states
 *
 * Props:
 *   students     - Array of student objects from API
 *   isLoading    - Boolean loading state
 *   loadError    - Error string if fetch failed
 *   searchQuery  - Current search term for display
 *   onEdit       - Callback(student) to start editing
 *   onDelete     - Callback(student) to open delete modal
 */

import React from 'react'
import LoadingSpinner from './LoadingSpinner'

const StudentTable = ({
  students,
  isLoading,
  loadError,
  searchQuery,
  onEdit,
  onDelete,
}) => {
  if (isLoading) return <LoadingSpinner />

  if (loadError) {
    return (
      <div className="state-container" role="alert">
        <div className="state-icon">⚠️</div>
        <p className="state-title">Unable to load students</p>
        <p className="state-subtitle">{loadError}</p>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="state-container">
        <div className="state-icon">{searchQuery ? '🔍' : '🎓'}</div>
        <p className="state-title">
          {searchQuery ? `No results for "${searchQuery}"` : 'No students yet'}
        </p>
        <p className="state-subtitle">
          {searchQuery
            ? 'Try a different search term or clear the search.'
            : 'Add your first student using the form above.'}
        </p>
      </div>
    )
  }

  return (
    <div className="table-wrapper">
      <table aria-label="Students list">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Department</th>
            <th scope="col">Year</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <span className="td-id">{student.id}</span>
              </td>
              <td className="td-name">{student.name}</td>
              <td className="td-email">{student.email}</td>
              <td className="td-phone">{student.phone}</td>
              <td>
                <span className="td-dept">{student.department}</span>
              </td>
              <td>
                <span className="td-year">{student.year}</span>
              </td>
              <td>
                <div className="table-actions">
                  <button
                    id={`edit-btn-${student.id}`}
                    className="btn btn-success btn-sm"
                    onClick={() => onEdit(student)}
                    aria-label={`Edit ${student.name}`}
                    title={`Edit ${student.name}`}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    id={`delete-btn-${student.id}`}
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(student)}
                    aria-label={`Delete ${student.name}`}
                    title={`Delete ${student.name}`}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentTable
