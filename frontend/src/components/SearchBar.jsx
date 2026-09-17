/**
 * Search bar component.
 * Searches across name, email, and department via backend query param.
 */

import React from 'react'

const SearchBar = ({ value, onChange, onClear, resultCount, totalCount, isSearching }) => {
  return (
    <div className="search-wrapper">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        id="student-search"
        type="search"
        className="search-input"
        placeholder="Search by name, email or department…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search students"
        autoComplete="off"
      />
      {value && (
        <button
          className="search-clear"
          onClick={onClear}
          aria-label="Clear search"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
