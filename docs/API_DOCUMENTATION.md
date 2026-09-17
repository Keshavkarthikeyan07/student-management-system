# 📡 API Documentation — Student Management System

> **Base URL (local development):** `http://127.0.0.1:8000`  
> **Content-Type:** `application/json`  
> **Version:** 1.0.0

---

## Table of Contents

1. [Authentication](#authentication)
2. [Endpoints Overview](#endpoints-overview)
3. [POST /api/students/](#1-create-student)
4. [GET /api/students/](#2-list-all-students)
5. [GET /api/students/?search=](#3-search-students)
6. [GET /api/students/{id}/](#4-get-single-student)
7. [PUT /api/students/{id}/](#5-full-update-student)
8. [PATCH /api/students/{id}/](#6-partial-update-student)
9. [DELETE /api/students/{id}/](#7-delete-student)
10. [Error Reference](#error-reference)
11. [Validation Rules](#validation-rules)
12. [Postman Testing Guide](#postman-testing-guide)

---

## Authentication

This API does **not** require authentication for local development. All endpoints are publicly accessible.

> In a production environment, token-based authentication (e.g. JWT) should be added.

---

## Endpoints Overview

| Method | Endpoint                    | Description               | Success Code |
|--------|-----------------------------|---------------------------|--------------|
| POST   | `/api/students/`            | Create a new student      | `201 Created` |
| GET    | `/api/students/`            | List all students         | `200 OK` |
| GET    | `/api/students/?search=term`| Search students           | `200 OK` |
| GET    | `/api/students/{id}/`       | Get a single student      | `200 OK` |
| PUT    | `/api/students/{id}/`       | Full update a student     | `200 OK` |
| PATCH  | `/api/students/{id}/`       | Partial update a student  | `200 OK` |
| DELETE | `/api/students/{id}/`       | Delete a student          | `204 No Content` |

---

## 1. Create Student

**`POST /api/students/`**

Creates a new student record in the database.

### Request Body

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+91-9876543210",
  "department": "Computer Science",
  "year": 2
}
```

### Field Descriptions

| Field       | Type    | Required | Constraints                          |
|-------------|---------|----------|--------------------------------------|
| name        | string  | ✅ Yes   | Max 200 chars, non-empty             |
| email       | string  | ✅ Yes   | Valid email format, unique           |
| phone       | string  | ✅ Yes   | 7–15 digits (spaces, +, -, () allowed)|
| department  | string  | ✅ Yes   | Max 200 chars, non-empty             |
| year        | integer | ✅ Yes   | Integer between 1 and 6 inclusive    |

### Success Response — `201 Created`

```json
{
  "message": "Student created successfully.",
  "student": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+91-9876543210",
    "department": "Computer Science",
    "year": 2,
    "created_at": "2024-09-16T08:30:00.000000Z",
    "updated_at": "2024-09-16T08:30:00.000000Z"
  }
}
```

### Error Response — `400 Bad Request` (Duplicate Email)

```json
{
  "email": [
    "A student with this email already exists."
  ]
}
```

### Error Response — `400 Bad Request` (Missing / Invalid Fields)

```json
{
  "name": ["This field is required."],
  "email": ["Enter a valid email address."],
  "year": ["Year must be between 1 and 6."]
}
```

---

## 2. List All Students

**`GET /api/students/`**

Returns all student records ordered by most recently created.

### Request

No body required. No parameters required.

### Success Response — `200 OK`

```json
{
  "count": 2,
  "results": [
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "phone": "5550200",
      "department": "Mathematics",
      "year": 3,
      "created_at": "2024-09-16T09:00:00.000000Z",
      "updated_at": "2024-09-16T09:00:00.000000Z"
    },
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+91-9876543210",
      "department": "Computer Science",
      "year": 2,
      "created_at": "2024-09-16T08:30:00.000000Z",
      "updated_at": "2024-09-16T08:30:00.000000Z"
    }
  ]
}
```

### Empty Response — `200 OK`

```json
{
  "count": 0,
  "results": []
}
```

---

## 3. Search Students

**`GET /api/students/?search=<term>`**

Searches across `name`, `email`, and `department` fields (case-insensitive).

### Query Parameters

| Parameter | Type   | Description                |
|-----------|--------|----------------------------|
| search    | string | Search term (partial match)|

### Example Request

```
GET /api/students/?search=alice
GET /api/students/?search=computer
GET /api/students/?search=alice@example
```

### Success Response — `200 OK`

```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+91-9876543210",
      "department": "Computer Science",
      "year": 2,
      "created_at": "2024-09-16T08:30:00.000000Z",
      "updated_at": "2024-09-16T08:30:00.000000Z"
    }
  ]
}
```

---

## 4. Get Single Student

**`GET /api/students/{id}/`**

Retrieves a single student by their numeric ID.

### URL Parameter

| Parameter | Type    | Description       |
|-----------|---------|-------------------|
| id        | integer | Student's numeric ID |

### Example Request

```
GET /api/students/1/
```

### Success Response — `200 OK`

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+91-9876543210",
  "department": "Computer Science",
  "year": 2,
  "created_at": "2024-09-16T08:30:00.000000Z",
  "updated_at": "2024-09-16T08:30:00.000000Z"
}
```

### Error Response — `404 Not Found`

```json
{
  "error": "Student with id 999 not found."
}
```

### Error Response — `400 Bad Request` (Non-numeric ID)

```json
{
  "error": "Invalid student ID."
}
```

---

## 5. Full Update Student

**`PUT /api/students/{id}/`**

Completely replaces all fields of a student. **All fields are required.**

### Request Body

```json
{
  "name": "Alice Johnson Updated",
  "email": "alice@example.com",
  "phone": "+91-9876543210",
  "department": "Data Science",
  "year": 3
}
```

### Success Response — `200 OK`

```json
{
  "message": "Student updated successfully.",
  "student": {
    "id": 1,
    "name": "Alice Johnson Updated",
    "email": "alice@example.com",
    "phone": "+91-9876543210",
    "department": "Data Science",
    "year": 3,
    "created_at": "2024-09-16T08:30:00.000000Z",
    "updated_at": "2024-09-16T10:15:00.000000Z"
  }
}
```

---

## 6. Partial Update Student

**`PATCH /api/students/{id}/`**

Updates only the provided fields. Other fields remain unchanged.

### Request Body (partial)

```json
{
  "year": 4
}
```

### Success Response — `200 OK`

```json
{
  "message": "Student updated successfully.",
  "student": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+91-9876543210",
    "department": "Computer Science",
    "year": 4,
    "created_at": "2024-09-16T08:30:00.000000Z",
    "updated_at": "2024-09-16T11:00:00.000000Z"
  }
}
```

---

## 7. Delete Student

**`DELETE /api/students/{id}/`**

Permanently deletes a student record from the database.

### Example Request

```
DELETE /api/students/1/
```

### Success Response — `204 No Content`

```json
{
  "message": "Student \"Alice Johnson\" deleted successfully."
}
```

### Error Response — `404 Not Found`

```json
{
  "error": "Student with id 1 not found."
}
```

---

## Error Reference

| HTTP Status | Code Description     | When It Occurs                          |
|-------------|----------------------|-----------------------------------------|
| `200 OK`    | Success              | GET, PUT, PATCH successful              |
| `201 Created` | Resource Created   | POST successful                         |
| `204 No Content` | Deleted         | DELETE successful                       |
| `400 Bad Request` | Validation Error | Invalid input, duplicate email       |
| `404 Not Found` | Resource Missing | Student ID does not exist             |
| `500 Internal Server Error` | Server Error | Unhandled server-side exception  |

---

## Validation Rules

### name
- Required
- Cannot be empty or whitespace-only
- Maximum 200 characters

### email
- Required
- Must match valid email format (contains `@` and domain)
- **Must be unique** across all students
- Stored as lowercase

### phone
- Required
- Can contain: digits, spaces, `+`, `-`, `(`, `)`
- Must have between **7 and 15 digits** (after stripping formatting)
- Examples: `+91-9876543210`, `555-0100`, `07911123456`

### department
- Required
- Cannot be empty or whitespace-only
- Maximum 200 characters

### year
- Required
- Must be an **integer**
- Must be between **1 and 6** (inclusive)

---

## Postman Testing Guide

### Setup

1. Open Postman
2. Create a new **Collection** named `Student Management System`
3. Set **Base URL** variable: `http://127.0.0.1:8000`

### Test Sequence

#### Test 1 — Create Student (Valid)
- Method: `POST`
- URL: `{{base_url}}/api/students/`
- Body → Raw → JSON:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+91-9876543210",
  "department": "Computer Science",
  "year": 2
}
```
- Expected: `201 Created`

#### Test 2 — List All Students
- Method: `GET`
- URL: `{{base_url}}/api/students/`
- Expected: `200 OK`, count ≥ 1

#### Test 3 — Search Students
- Method: `GET`
- URL: `{{base_url}}/api/students/?search=alice`
- Expected: `200 OK`, count = 1

#### Test 4 — Get Single Student
- Method: `GET`
- URL: `{{base_url}}/api/students/1/`
- Expected: `200 OK`

#### Test 5 — Update Student (PUT)
- Method: `PUT`
- URL: `{{base_url}}/api/students/1/`
- Body:
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+91-9876543210",
  "department": "Data Science",
  "year": 3
}
```
- Expected: `200 OK`

#### Test 6 — Partial Update (PATCH)
- Method: `PATCH`
- URL: `{{base_url}}/api/students/1/`
- Body: `{ "year": 4 }`
- Expected: `200 OK`

#### Test 7 — Delete Student
- Method: `DELETE`
- URL: `{{base_url}}/api/students/1/`
- Expected: `204 No Content`

---

### Error Test Cases

#### Error Test 1 — Missing Name
- Method: `POST`
- Body:
```json
{
  "email": "test@example.com",
  "phone": "1234567890",
  "department": "CS",
  "year": 1
}
```
- Expected: `400 Bad Request`, `{"name": ["This field is required."]}`

#### Error Test 2 — Invalid Email Format
- Body: `{ "name": "Test", "email": "not-valid", "phone": "1234567", "department": "CS", "year": 1 }`
- Expected: `400 Bad Request`, `{"email": ["Enter a valid email address."]}`

#### Error Test 3 — Duplicate Email
- POST same email twice
- Expected: `400 Bad Request`, `{"email": ["A student with this email already exists."]}`

#### Error Test 4 — Invalid Year (too high)
- Body: `{ ..., "year": 10 }`
- Expected: `400 Bad Request`, `{"year": ["Year must be between 1 and 6."]}`

#### Error Test 5 — Invalid Year (zero)
- Body: `{ ..., "year": 0 }`
- Expected: `400 Bad Request`

#### Error Test 6 — Invalid Phone
- Body: `{ ..., "phone": "abc-not-a-phone" }`
- Expected: `400 Bad Request`, `{"phone": [...]}`

#### Error Test 7 — Student Not Found
- `GET /api/students/99999/`
- Expected: `404 Not Found`, `{"error": "Student with id 99999 not found."}`
