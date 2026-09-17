/**
 * Dashboard page — main view of the Student Management System.
 *
 * Responsibilities:
 * - Fetch students from Django REST API on mount and after mutations
 * - Coordinate StudentForm, StudentTable, SearchBar, Modal, Toast
 * - Handle all CRUD operations with proper loading and error states
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import StudentForm from '../components/StudentForm'
import StudentTable from '../components/StudentTable'
import SearchBar from '../components/SearchBar'
import Modal from '../components/Modal'
import { listStudents, deleteStudent } from '../services/api'

const Dashboard = ({ onToast, onStudentCountChange }) => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingStudent, setEditingStudent] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showForm, setShowForm] = useState(true)

  // Debounce timer ref
  const searchTimer = useRef(null)

  // ── Fetch students ────────────────────────────────────────────────────────

  const fetchStudents = useCallback(async (query = '') => {
    setIsLoading(true)
    setLoadError('')
    try {
      const data = await listStudents(query)
      const results = data.results || []
      setStudents(results)
      // Update header badge with total student count (always use full count when no search)
      if (onStudentCountChange) {
        onStudentCountChange(query ? data.count : data.count)
      }
    } catch (err) {
      setLoadError(err.message || 'Unable to load students. Is the backend running?')
      setStudents([])
    } finally {
      setIsLoading(false)
    }
  }, [onStudentCountChange])

  // Initial load
  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  // ── Search with debounce ─────────────────────────────────────────────────

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      fetchStudents(value)
    }, 350)
  }

  const handleSearchClear = () => {
    setSearchQuery('')
    fetchStudents('')
  }

  // ── CRUD callbacks ────────────────────────────────────────────────────────

  const handleFormSuccess = () => {
    setEditingStudent(null)
    fetchStudents(searchQuery)
  }

  const handleEditClick = (student) => {
    setEditingStudent(student)
    setShowForm(true)
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingStudent(null)
  }

  const handleDeleteClick = (student) => {
    setDeleteTarget(student)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteStudent(deleteTarget.id)
      onToast('success', `Student "${deleteTarget.name}" deleted successfully.`)
      setDeleteTarget(null)
      fetchStudents(searchQuery)
    } catch (err) {
      onToast('error', err.message || 'Failed to delete student.')
      setDeleteTarget(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const departments = [...new Set(students.map((s) => s.department))].length
  const latestYear = students.length
    ? Math.max(...students.map((s) => s.year))
    : 0

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon purple" aria-hidden="true">🎓</div>
          <div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green" aria-hidden="true">🏛️</div>
          <div>
            <div className="stat-value">{departments}</div>
            <div className="stat-label">Departments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue" aria-hidden="true">📅</div>
          <div>
            <div className="stat-value">{latestYear || '—'}</div>
            <div className="stat-label">Highest Year</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange" aria-hidden="true">🔍</div>
          <div>
            <div className="stat-value">{searchQuery ? students.length : '—'}</div>
            <div className="stat-label">Search Results</div>
          </div>
        </div>
      </div>

      {/* Student Form */}
      <StudentForm
        editingStudent={editingStudent}
        onSuccess={handleFormSuccess}
        onCancel={handleCancelEdit}
        onShowToast={onToast}
      />

      {/* Toolbar: search + count */}
      <div className="toolbar">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
        />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          {isLoading
            ? 'Loading…'
            : searchQuery
              ? `${students.length} result${students.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `${students.length} student${students.length !== 1 ? 's' : ''} total`}
        </div>
      </div>

      {/* Table panel */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <span aria-hidden="true">📋</span>
            Student Records
          </span>
        </div>
        <div style={{ padding: 0 }}>
          <StudentTable
            students={students}
            isLoading={isLoading}
            loadError={loadError}
            searchQuery={searchQuery}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        student={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={isDeleting}
      />
    </>
  )
}

export default Dashboard
