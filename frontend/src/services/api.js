/**
 * api.js — Centralized Axios service for Django REST API
 *
 * All API calls go through this module.
 * Base URL: http://127.0.0.1:8000  (proxied via Vite in dev)
 *
 * Endpoints:
 *   GET    /api/students/          → listStudents(search)
 *   POST   /api/students/          → createStudent(data)
 *   GET    /api/students/{id}/     → getStudent(id)
 *   PUT    /api/students/{id}/     → updateStudent(id, data)
 *   PATCH  /api/students/{id}/     → patchStudent(id, data)
 *   DELETE /api/students/{id}/     → deleteStudent(id)
 */

import axios from 'axios'

// When using Vite proxy, requests to /api/* are forwarded to Django
const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
})

// ── Response interceptor: normalise errors ──────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error or Django not running
      return Promise.reject({
        message: 'Unable to connect to the server. Please make sure the backend is running.',
        type: 'network',
      })
    }

    const { status, data } = error.response

    if (status === 404) {
      return Promise.reject({
        message: data?.error || 'Student not found.',
        type: 'not_found',
        status,
      })
    }

    if (status === 400) {
      // DRF validation errors — pass through raw for form display
      return Promise.reject({
        message: 'Validation error. Please check your input.',
        type: 'validation',
        errors: data,
        status,
      })
    }

    if (status === 500) {
      return Promise.reject({
        message: 'Internal server error. Please try again later.',
        type: 'server',
        status,
      })
    }

    return Promise.reject({
      message: data?.error || data?.detail || 'An unexpected error occurred.',
      type: 'unknown',
      status,
    })
  }
)

// ── API functions ───────────────────────────────────────────────────────────

/**
 * Get all students, optionally filtered by search term.
 * @param {string} search - Optional search query
 * @returns {Promise<{count: number, results: Student[]}>}
 */
export const listStudents = async (search = '') => {
  const params = search ? { search } : {}
  const response = await api.get('/students/', { params })
  return response.data
}

/**
 * Create a new student.
 * @param {Object} data - Student data
 * @returns {Promise<{message: string, student: Student}>}
 */
export const createStudent = async (data) => {
  const response = await api.post('/students/', data)
  return response.data
}

/**
 * Get a single student by ID.
 * @param {number} id
 * @returns {Promise<Student>}
 */
export const getStudent = async (id) => {
  const response = await api.get(`/students/${id}/`)
  return response.data
}

/**
 * Fully update a student (PUT).
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<{message: string, student: Student}>}
 */
export const updateStudent = async (id, data) => {
  const response = await api.put(`/students/${id}/`, data)
  return response.data
}

/**
 * Partially update a student (PATCH).
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<{message: string, student: Student}>}
 */
export const patchStudent = async (id, data) => {
  const response = await api.patch(`/students/${id}/`, data)
  return response.data
}

/**
 * Delete a student by ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteStudent = async (id) => {
  await api.delete(`/students/${id}/`)
}

export default api
