# 🧪 Testing — Student Management System

## Overview

The Student Management System includes two levels of testing:

1. **Automated Backend Tests** — Django/DRF unit tests (17 test cases)
2. **Manual API Tests** — Postman testing guide

---

## Running Automated Tests

### Prerequisites

- Python virtual environment activated
- MySQL database running and `.env` configured

> **Note:** Automated tests use Django's built-in test runner which creates a **separate test database** automatically. Your production data is never affected.

### Command

```bash
cd backend

# Windows
venv\Scripts\activate
python manage.py test students --verbosity=2

# macOS/Linux
source venv/bin/activate
python manage.py test students --verbosity=2
```

### Expected Output

```
Creating test database for alias 'default'...
System check identified no issues (0 silenced).

test_create_student_duplicate_email (students.tests.CreateStudentTests) ... ok
test_create_student_invalid_email (students.tests.CreateStudentTests) ... ok
test_create_student_invalid_phone (students.tests.CreateStudentTests) ... ok
test_create_student_invalid_year_too_high (students.tests.CreateStudentTests) ... ok
test_create_student_invalid_year_too_low (students.tests.CreateStudentTests) ... ok
test_create_student_missing_email (students.tests.CreateStudentTests) ... ok
test_create_student_missing_name (students.tests.CreateStudentTests) ... ok
test_create_student_success (students.tests.CreateStudentTests) ... ok
test_delete_student_not_found (students.tests.DeleteStudentTests) ... ok
test_delete_student_success (students.tests.DeleteStudentTests) ... ok
test_list_students_success (students.tests.ListStudentsTests) ... ok
test_patch_update_success (students.tests.UpdateStudentTests) ... ok
test_put_update_success (students.tests.UpdateStudentTests) ... ok
test_retrieve_student_not_found (students.tests.RetrieveStudentTests) ... ok
test_retrieve_student_success (students.tests.RetrieveStudentTests) ... ok
test_search_by_department (students.tests.ListStudentsTests) ... ok
test_search_by_name (students.tests.ListStudentsTests) ... ok
test_search_no_match (students.tests.ListStudentsTests) ... ok
test_update_duplicate_email (students.tests.UpdateStudentTests) ... ok

----------------------------------------------------------------------
Ran 17 tests in 0.XXXs

OK
Destroying test database for alias 'default'...
```

All 17 tests should pass with `OK` status.

---

## Test Cases Reference

### Group 1: Create Student Tests

| # | Test Case | Input | Expected Status | Assertion |
|---|-----------|-------|----------------|-----------|
| 1 | Create student — success | Valid data (name, email, phone, dept, year) | `201 Created` | Student count = 1, message = "Student created successfully." |
| 2 | Create student — duplicate email | Same email as existing student | `400 Bad Request` | `"email"` key in response |
| 3 | Create student — missing name | No `name` field | `400 Bad Request` | `"name"` key in response |
| 4 | Create student — missing email | No `email` field | `400 Bad Request` | `400` status |
| 5 | Create student — invalid email | `"not-an-email"` | `400 Bad Request` | `"email"` key in response |
| 6 | Create student — year too low | `"year": 0` | `400 Bad Request` | `"year"` key in response |
| 7 | Create student — year too high | `"year": 7` | `400 Bad Request` | `"year"` key in response |
| 8 | Create student — invalid phone | `"phone": "abc-not-a-phone"` | `400 Bad Request` | `"phone"` key in response |

### Group 2: List Students Tests

| # | Test Case | Input | Expected Status | Assertion |
|---|-----------|-------|----------------|-----------|
| 9 | List students — success | GET with 2 students in DB | `200 OK` | count = 2 |
| 10 | Search by name | `?search=Alice` | `200 OK` | count = 1, name = "Alice Johnson" |
| 11 | Search by department | `?search=Math` | `200 OK` | count = 1, dept = "Mathematics" |
| 12 | Search — no match | `?search=XYZ_NOT_EXIST` | `200 OK` | count = 0 |

### Group 3: Retrieve Single Student Tests

| # | Test Case | Input | Expected Status | Assertion |
|---|-----------|-------|----------------|-----------|
| 13 | Retrieve student — success | Valid ID | `200 OK` | email = "alice@example.com" |
| 14 | Retrieve student — not found | ID = 99999 | `404 Not Found` | 404 status |

### Group 4: Update Student Tests

| # | Test Case | Input | Expected Status | Assertion |
|---|-----------|-------|----------------|-----------|
| 15 | PUT update — success | All fields, new department | `200 OK` | department = "Data Science" |
| 16 | PATCH update — partial | Only `{"year": 4}` | `200 OK` | year = 4 |
| 17 | Update — duplicate email | PATCH with another student's email | `400 Bad Request` | `"email"` key |

### Group 5: Delete Student Tests

| # | Test Case | Input | Expected Status | Assertion |
|---|-----------|-------|----------------|-----------|
| 18 | Delete — success | Valid ID | `204 No Content` | Student.objects.count() = 0 |
| 19 | Delete — not found | ID = 99999 | `404 Not Found` | 404 status |

---

## Manual Testing Checklist

### Backend Manual Tests (via Postman or curl)

```bash
# Start the Django server first
cd backend
venv\Scripts\activate
python manage.py runserver
```

| # | Test | Command / URL | Expected |
|---|------|--------------|----------|
| 1 | API Root | `GET http://127.0.0.1:8000/` | 200, API info JSON |
| 2 | List (empty) | `GET /api/students/` | 200, count=0 |
| 3 | Create valid | `POST /api/students/` valid JSON | 201 |
| 4 | List (1 student) | `GET /api/students/` | 200, count=1 |
| 5 | Get one | `GET /api/students/1/` | 200, student JSON |
| 6 | Update | `PUT /api/students/1/` full body | 200 |
| 7 | Partial update | `PATCH /api/students/1/ {"year":4}` | 200 |
| 8 | Delete | `DELETE /api/students/1/` | 204 |
| 9 | Not found | `GET /api/students/9999/` | 404 |
| 10 | Duplicate email | `POST` same email | 400, email error |
| 11 | Invalid year | `POST` with year=10 | 400, year error |
| 12 | Search name | `GET /api/students/?search=alice` | 200, filtered |
| 13 | Search dept | `GET /api/students/?search=computer` | 200, filtered |

---

## Frontend Manual Tests

### UI Verification Checklist

Start both servers:
```bash
# Terminal 1 — Backend
cd backend && venv\Scripts\activate && python manage.py runserver

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open: `http://localhost:5173`

| # | Feature | Steps | Expected |
|---|---------|-------|---------|
| 1 | Page loads | Open browser | Dashboard displays with empty state |
| 2 | Add student | Fill all fields, click "Add Student" | Success toast, student appears in table |
| 3 | Form validation | Submit empty form | Red error messages on all fields |
| 4 | Bad email | Enter `invalid@` | Error message: "Please enter a valid email address." |
| 5 | Duplicate email | Add same email twice | Error message from backend in email field |
| 6 | Edit student | Click ✏️ Edit | Form pre-fills with student data |
| 7 | Update student | Modify name, click "Update Student" | Success toast, table updates |
| 8 | Delete student | Click 🗑️ Delete | Confirmation modal appears |
| 9 | Confirm delete | Click "Yes, Delete" in modal | Success toast, row removed |
| 10 | Cancel delete | Click "Cancel" in modal | Modal closes, no deletion |
| 11 | Search by name | Type in search bar | Table filters in real-time (debounced) |
| 12 | Search by dept | Type department name | Table filters correctly |
| 13 | Clear search | Click ✕ on search | All students reload |
| 14 | Empty state | Search for nonsense text | "No results for..." message |
| 15 | Loading state | (slow connection) | Spinner displays during fetch |
| 16 | Backend offline | Stop Django, refresh | "Unable to load students" error |
| 17 | Stats bar | Add students from different depts | Stats update correctly |
| 18 | Mobile layout | Resize window < 768px | Phone/email columns hide, form stacks |
| 19 | Header count | Add/delete students | Student count in header updates |
| 20 | Toast auto-dismiss | Trigger any toast | Toast disappears after ~4 seconds |

---

## curl Test Commands (alternative to Postman)

```bash
# List all students
curl http://127.0.0.1:8000/api/students/

# Create student
curl -X POST http://127.0.0.1:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890","department":"CS","year":1}'

# Get student by ID
curl http://127.0.0.1:8000/api/students/1/

# Update student (PUT)
curl -X PUT http://127.0.0.1:8000/api/students/1/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated User","email":"test@example.com","phone":"1234567890","department":"IT","year":2}'

# Partial update (PATCH)
curl -X PATCH http://127.0.0.1:8000/api/students/1/ \
  -H "Content-Type: application/json" \
  -d '{"year":3}'

# Delete student
curl -X DELETE http://127.0.0.1:8000/api/students/1/

# Search
curl "http://127.0.0.1:8000/api/students/?search=alice"

# Test invalid data
curl -X POST http://127.0.0.1:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad-email","phone":"abc","department":"","year":99}'
```
