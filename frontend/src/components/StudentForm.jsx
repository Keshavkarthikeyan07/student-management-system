/**
 * StudentForm component.
 *
 * Used for both creating and editing students.
 * - Client-side validation on all fields
 * - Displays server-side validation errors from the API
 * - Sends POST (create) or PUT (edit) to Django REST API
 *
 * Props:
 *   editingStudent  - Student object when editing, null for create
 *   onSuccess       - Callback after successful save
 *   onCancel        - Callback to cancel editing
 *   onShowToast     - Function(type, message) to display notifications
 */

import React, { useState, useEffect } from 'react'
import { createStudent, updateStudent } from '../services/api'

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Business Administration',
  'Commerce',
  'Arts',
  'Other',
]

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  department: '',
  year: '',
}

const EMPTY_ERRORS = {
  name: '',
  email: '',
  phone: '',
  department: '',
  year: '',
}

// ── Client-side validators ──────────────────────────────────────────────────

const validateField = (name, value) => {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Name is required.'
      if (value.trim().length < 2) return 'Name must be at least 2 characters.'
      if (value.trim().length > 200) return 'Name cannot exceed 200 characters.'
      return ''

    case 'email':
      if (!value.trim()) return 'Email is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
        return 'Please enter a valid email address.'
      return ''

    case 'phone': {
      if (!value.trim()) return 'Phone number is required.'
      const cleaned = value.replace(/[\s\-\+\(\)]/g, '')
      if (!/^\d+$/.test(cleaned)) return 'Phone must contain only digits.'
      if (cleaned.length < 7 || cleaned.length > 15)
        return 'Phone must be between 7 and 15 digits.'
      return ''
    }

    case 'department':
      if (!value.trim()) return 'Department is required.'
      return ''

    case 'year': {
      if (value === '' || value === null || value === undefined) return 'Year is required.'
      const num = Number(value)
      if (!Number.isInteger(num)) return 'Year must be a whole number.'
      if (num < 1 || num > 6) return 'Year must be between 1 and 6.'
      return ''
    }

    default:
      return ''
  }
}

const validateAll = (form) => {
  const errors = {}
  let isValid = true
  Object.keys(form).forEach((key) => {
    const err = validateField(key, form[key])
    errors[key] = err
    if (err) isValid = false
  })
  return { errors, isValid }
}

// ── Map DRF error response to form field errors ─────────────────────────────

const mapServerErrors = (serverErrors) => {
  const fieldErrors = { ...EMPTY_ERRORS }
  if (serverErrors && typeof serverErrors === 'object') {
    Object.keys(serverErrors).forEach((key) => {
      if (key in fieldErrors) {
        const messages = serverErrors[key]
        fieldErrors[key] = Array.isArray(messages) ? messages.join(' ') : String(messages)
      }
    })
  }
  return fieldErrors
}

// ── Component ───────────────────────────────────────────────────────────────

const StudentForm = ({ editingStudent, onSuccess, onCancel, onShowToast }) => {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState(EMPTY_ERRORS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = Boolean(editingStudent)

  // Populate form when editing
  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name || '',
        email: editingStudent.email || '',
        phone: editingStudent.phone || '',
        department: editingStudent.department || '',
        year: String(editingStudent.year) || '',
      })
      setErrors(EMPTY_ERRORS)
    } else {
      setForm(EMPTY_FORM)
      setErrors(EMPTY_ERRORS)
    }
  }, [editingStudent])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Live validation
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { errors: validationErrors, isValid } = validateAll(form)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        department: form.department.trim(),
        year: parseInt(form.year, 10),
      }

      if (isEditing) {
        await updateStudent(editingStudent.id, payload)
        onShowToast('success', 'Student updated successfully.')
      } else {
        await createStudent(payload)
        onShowToast('success', 'Student added successfully.')
      }

      setForm(EMPTY_FORM)
      setErrors(EMPTY_ERRORS)
      onSuccess()
    } catch (err) {
      if (err.type === 'validation' && err.errors) {
        // Map server errors to form fields
        setErrors(mapServerErrors(err.errors))
        onShowToast('error', 'Please fix the validation errors below.')
      } else {
        onShowToast('error', err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setErrors(EMPTY_ERRORS)
    onCancel()
  }

  return (
    <div className="form-panel">
      <div className="form-panel-header">
        <div className="form-panel-title">
          <span aria-hidden="true">{isEditing ? '✏️' : '➕'}</span>
          {isEditing ? 'Edit Student' : 'Add New Student'}
          <span className="badge">{isEditing ? 'Editing' : 'New'}</span>
        </div>
      </div>

      <div className="form-panel-body">
        <form id="student-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="student-name"
                name="name"
                type="text"
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Alice Johnson"
                value={form.name}
                onChange={handleChange}
                maxLength={200}
                autoComplete="name"
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <span id="name-error" className="form-error" role="alert">⚠ {errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="student-email"
                name="email"
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="e.g. alice@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span id="email-error" className="form-error" role="alert">⚠ {errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-phone">
                Phone Number <span className="required">*</span>
              </label>
              <input
                id="student-phone"
                name="phone"
                type="tel"
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="e.g. +91-9876543210"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <span id="phone-error" className="form-error" role="alert">⚠ {errors.phone}</span>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-department">
                Department <span className="required">*</span>
              </label>
              <select
                id="student-department"
                name="department"
                className={`form-control ${errors.department ? 'error' : ''}`}
                value={form.department}
                onChange={handleChange}
                aria-describedby={errors.department ? 'dept-error' : undefined}
              >
                <option value="">Select department…</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <span id="dept-error" className="form-error" role="alert">⚠ {errors.department}</span>
              )}
            </div>

            {/* Year */}
            <div className="form-group">
              <label className="form-label" htmlFor="student-year">
                Year of Study <span className="required">*</span>
              </label>
              <select
                id="student-year"
                name="year"
                className={`form-control ${errors.year ? 'error' : ''}`}
                value={form.year}
                onChange={handleChange}
                aria-describedby={errors.year ? 'year-error' : undefined}
              >
                <option value="">Select year…</option>
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
              {errors.year && (
                <span id="year-error" className="form-error" role="alert">⚠ {errors.year}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            {isEditing && (
              <button
                id="cancel-btn"
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                ✕ Cancel
              </button>
            )}
            <button
              id="submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner"
                    style={{ width: 16, height: 16, borderWidth: 2 }}
                    aria-hidden="true"
                  />
                  {isEditing ? 'Updating…' : 'Adding…'}
                </>
              ) : (
                <>{isEditing ? '💾 Update Student' : '➕ Add Student'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm
