/**
 * Delete confirmation modal.
 * Shows student name and asks for explicit confirmation.
 */

import React from 'react'

const Modal = ({ student, onConfirm, onCancel, isDeleting }) => {
  if (!student) return null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="modal">
        <div className="modal-icon" aria-hidden="true">🗑️</div>

        <h2 className="modal-title" id="modal-title">Delete Student?</h2>

        <p className="modal-body">
          Are you sure you want to delete{' '}
          <strong>{student.name}</strong>?<br />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {student.email}
          </span>
          <br />
          <br />
          This action <strong>cannot be undone</strong>.
        </p>

        <div className="modal-actions">
          <button
            id="modal-cancel-btn"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="modal-confirm-btn"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Deleting...
              </>
            ) : (
              '🗑️ Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
