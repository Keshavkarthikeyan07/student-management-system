# PROJECT REPORT

## Student Management System

---

| Field            | Detail                                    |
|------------------|-------------------------------------------|
| **Project Title**| Student Management System                 |
| **Course**       | Full-Stack Web Application Development    |
| **Technology**   | React • Django • MySQL                    |
| **Version**      | 1.0.0                                     |
| **Date**         | September 2024                            |

---

## ABSTRACT

This report documents the design, development, and testing of a complete full-stack **Student Management System** (SMS) web application. The system enables administrators to perform all fundamental CRUD (Create, Read, Update, Delete) operations on student records through a modern, responsive web interface.

The application is built using **React 18** (frontend), **Django 4.2 with Django REST Framework** (backend), and **MySQL 8.0** (database). The system demonstrates a clean three-tier architecture with full separation of concerns between the presentation, business logic, and data layers. The frontend communicates with the backend exclusively through a REST API, and all data is persisted in a relational MySQL database.

Key deliverables include: a real-time student search, client-side and server-side validation, comprehensive error handling, automated test coverage, and responsive design that works on desktop and mobile devices.

---

## 1. INTRODUCTION

Web-based management systems have become an essential tool in modern educational institutions. Traditional paper-based or spreadsheet-based student record systems suffer from several limitations: difficulty in searching and filtering records, lack of real-time updates, poor accessibility across devices, and no automated data validation.

A **Student Management System** built on modern web technologies addresses all these limitations. By separating the frontend interface from the backend API, the system achieves maintainability, scalability, and a clean developer experience.

This project was developed following the college Standard Operating Procedure (SOP) for complete CRUD-based web application development, covering all phases from requirement analysis through documentation and testing.

---

## 2. PROBLEM STATEMENT

Educational institutions commonly face the following challenges in student record management:

1. **Manual processes** — Paper records are slow to search and update
2. **Data inconsistency** — No validation means incorrect emails, phone numbers, and year values can be stored
3. **Poor accessibility** — Desktop-only software cannot be accessed on mobile devices
4. **Lack of feedback** — Users receive no confirmation or error messages after operations
5. **No audit trail** — No timestamps for when records were created or modified
6. **Fragile data entry** — Duplicate students (same email) can be accidentally created

The Student Management System solves all of the above by implementing a validated, real-time, web-accessible CRUD application.

---

## 3. OBJECTIVES

The primary objectives of this project are:

1. Build a complete **full-stack web application** using industry-standard technologies
2. Implement all **four CRUD operations** with real database persistence
3. Implement **dual-layer validation** (client-side + server-side)
4. Design a **REST API** following HTTP standards and proper status codes
5. Create a **responsive UI** that works on desktop, tablet, and mobile
6. Implement **search functionality** across multiple fields
7. Provide **user feedback** through toast notifications and error messages
8. Write **automated tests** for all API endpoints
9. Follow **security best practices** (environment variables, ORM queries, .gitignore)
10. Produce complete **project documentation** suitable for academic submission

---

## 4. SCOPE

### In Scope

- Student record management (CRUD)
- Real-time search by name, email, and department
- Client-side and server-side validation
- REST API with standard HTTP status codes
- MySQL database with Django ORM
- Responsive web design
- Toast notifications and error handling
- Automated backend testing
- Complete documentation

### Out of Scope

- User authentication / login system
- Role-based access control (admin vs. teacher vs. student)
- Student photo upload
- Course and grade management
- Export to PDF/Excel
- Email notifications

---

## 5. SYSTEM REQUIREMENTS

### Hardware Requirements (Minimum)

| Component | Requirement |
|-----------|-------------|
| Processor | Dual-core, 2GHz+ |
| RAM       | 4GB minimum, 8GB recommended |
| Storage   | 2GB free disk space |
| Network   | Local network (localhost) |

### Software Requirements

| Software       | Version     | Purpose                          |
|----------------|-------------|----------------------------------|
| Python         | 3.10+       | Backend runtime                  |
| Django         | 4.2.13      | Web framework                    |
| DRF            | 3.15.2      | REST API layer                   |
| mysqlclient    | 2.2.4       | MySQL driver for Python          |
| python-decouple| 3.8         | Environment variable management  |
| django-cors-headers | 4.3.1  | Cross-origin request handling    |
| Node.js        | 18+         | Frontend JavaScript runtime      |
| React          | 18.3.1      | Frontend UI library              |
| Vite           | 5.3.1       | Frontend build tool + dev server |
| Axios          | 1.7.2       | HTTP client                      |
| MySQL          | 8.0+        | Relational database              |
| Git            | 2.40+       | Version control                  |

---

## 6. TECHNOLOGY STACK

```
┌─────────────────────────────────────────────┐
│             TECHNOLOGY STACK                │
├────────────┬────────────────────────────────┤
│ Layer      │ Technology                     │
├────────────┼────────────────────────────────┤
│ Frontend   │ React 18 + Vite + Axios        │
│ Styling    │ Vanilla CSS (glassmorphism)     │
│ Backend    │ Python + Django 4.2 + DRF      │
│ API        │ REST (HTTP/JSON)               │
│ Database   │ MySQL 8.0 via Django ORM       │
│ Config     │ python-decouple (.env)         │
│ Version    │ Git / GitHub                   │
└────────────┴────────────────────────────────┘
```

### Why This Stack?

- **React** provides component-based UI with reactive state management
- **Django** offers a mature, batteries-included Python web framework
- **DRF** provides serialization, validation, and API views out of the box
- **MySQL** is a proven, ACID-compliant relational database ideal for student records
- **Vite** gives extremely fast development server with Hot Module Replacement
- **Axios** provides global interceptors for consistent error handling

---

## 7. SYSTEM ARCHITECTURE

The system follows a **3-tier client-server architecture**:

```
Tier 1: Presentation Layer
  └── React (browser)
        │
        │  HTTP/REST (JSON)
        ▼
Tier 2: Application / Business Logic Layer
  └── Django + DRF (Python server)
        │
        │  SQL (via Django ORM)
        ▼
Tier 3: Data Layer
  └── MySQL Database
```

**Data flows** in both directions:
- **Upward**: User interaction → React state → Axios HTTP → Django view → MySQL query
- **Downward**: MySQL result → Django serializer → JSON response → React state → UI update

---

## 8. DATABASE DESIGN

### Entity: Student

| Attribute   | Type          | Constraint                   |
|-------------|---------------|------------------------------|
| id          | BIGINT        | PRIMARY KEY, AUTO INCREMENT  |
| name        | VARCHAR(200)  | NOT NULL                     |
| email       | VARCHAR(254)  | NOT NULL, UNIQUE             |
| phone       | VARCHAR(20)   | NOT NULL                     |
| department  | VARCHAR(200)  | NOT NULL                     |
| year        | SMALLINT      | NOT NULL, CHECK 1≤year≤6     |
| created_at  | DATETIME      | AUTO (on insert)             |
| updated_at  | DATETIME      | AUTO (on every update)       |

### ER Diagram

```
┌──────────────────────────────────────────┐
│                 STUDENT                  │
├──────────────────────────────────────────┤
│  PK  id          BIGINT AUTO_INCREMENT  │
│      name        VARCHAR(200) NOT NULL  │
│  UK  email       VARCHAR(254) NOT NULL  │
│      phone       VARCHAR(20)  NOT NULL  │
│      department  VARCHAR(200) NOT NULL  │
│      year        SMALLINT     NOT NULL  │
│      created_at  DATETIME     NOT NULL  │
│      updated_at  DATETIME     NOT NULL  │
└──────────────────────────────────────────┘
```

*PK = Primary Key, UK = Unique Key*

---

## 9. FRONTEND DESIGN

### Design System

The frontend uses a **dark glassmorphism** design with:
- Dark background (`#0f1117`) with radial gradient overlays
- Glass-effect cards with `backdrop-filter: blur()`
- Indigo-to-purple gradient accents (`#6366f1` → `#8b5cf6`)
- Inter font (Google Fonts)
- Smooth micro-animations on hover, focus, and state changes

### Component Hierarchy

```
App.jsx (root)
├── Header.jsx           — Sticky nav with student count badge
├── ToastContainer.jsx   — Notification system (top-right)
└── Dashboard.jsx        — Main orchestrator
    ├── Stats bar        — Total, Departments, Highest Year, Search Results
    ├── StudentForm.jsx  — Add / Edit form (dual mode)
    ├── SearchBar.jsx    — Debounced backend search
    ├── StudentTable.jsx — Data table with Edit/Delete actions
    └── Modal.jsx        — Delete confirmation dialog
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| > 768px | Full layout: 2-column form grid, full table |
| ≤ 768px | 1-column form, email/phone columns hidden |
| ≤ 480px | Logo text hidden, form buttons full-width |

---

## 10. BACKEND DESIGN

### Project Structure

```
backend/
├── config/          ← Django project settings, URLs
└── students/        ← Student app (model, views, serializer, tests)
```

### Request Processing Flow

```
HTTP Request
    │
    ▼
URL Router (config/urls.py)
    │
    ▼
View Function (students/views.py)
    │
    ▼
Serializer (students/serializers.py)
    │  ├── field-level validators
    │  └── cross-field validators (unique email)
    │
    ▼
Model (students/models.py) → ORM
    │
    ▼
MySQL Database
    │
    ▼
JSON Response
```

---

## 11. REST API

| Method | Endpoint               | Purpose               | Status |
|--------|------------------------|-----------------------|--------|
| GET    | `/api/students/`       | List all students     | 200    |
| GET    | `/api/students/?search=`| Search students      | 200    |
| POST   | `/api/students/`       | Create student        | 201    |
| GET    | `/api/students/{id}/`  | Get single student    | 200    |
| PUT    | `/api/students/{id}/`  | Full update           | 200    |
| PATCH  | `/api/students/{id}/`  | Partial update        | 200    |
| DELETE | `/api/students/{id}/`  | Delete student        | 204    |

---

## 12. CRUD OPERATIONS

### CREATE
- User fills Student Form (name, email, phone, department, year)
- Client-side validation runs first
- `POST /api/students/` sends JSON payload
- DRF serializer validates and saves to MySQL
- Response: `201 Created` + student object
- UI: success toast + form reset + table refresh

### READ
- On page load: `GET /api/students/` fetches all records
- Records render in a sortable table with ID, name, email, phone, department, year
- Empty state displays if no records exist

### UPDATE
- User clicks ✏️ Edit on a row
- Form pre-fills with existing data
- User modifies fields and submits
- `PUT /api/students/{id}/` sends full updated payload
- UI: success toast + table refresh

### DELETE
- User clicks 🗑️ Delete on a row
- Confirmation modal appears: "Are you sure you want to delete {name}?"
- On confirm: `DELETE /api/students/{id}/`
- Response: `204 No Content`
- UI: success toast + row removed

---

## 13. VALIDATION

### Client-Side (React)

| Field | Rules |
|-------|-------|
| name | Required, min 2 chars, max 200 chars |
| email | Required, valid format (regex) |
| phone | Required, 7–15 digits |
| department | Required |
| year | Required, integer 1–6 |

Errors display inline, in red, below each field.

### Server-Side (Django DRF)

All client-side rules are re-enforced, plus:
- Email uniqueness checked against the database
- Email normalised to lowercase before storage
- Name and department stripped of leading/trailing whitespace

This **dual-layer approach** ensures data integrity even if the frontend is bypassed (e.g., via Postman or direct API calls).

---

## 14. ERROR HANDLING

### Frontend

| Scenario | Handling |
|----------|----------|
| Backend offline | "Unable to connect to server" error state |
| 404 Not Found | Toast with "Student not found." |
| 400 Validation | Field errors displayed inline |
| 500 Server Error | Toast with "Internal server error." |
| Empty results | "No students found." empty state |

### Backend

| Scenario | Response |
|----------|----------|
| Invalid student ID | `400 {"error": "Invalid student ID."}` |
| Student not found | `404 {"error": "Student with id X not found."}` |
| Validation failure | `400 {field: [error messages]}` |
| Duplicate email | `400 {"email": ["A student with this email already exists."]}` |

---

## 15. TESTING

### Automated Tests (17 test cases)

Implemented using Django's `APITestCase` from `rest_framework.test`.

**Test Groups:**
- `CreateStudentTests` — 8 tests (valid create, duplicates, invalid fields)
- `ListStudentsTests` — 4 tests (list, search by name/department/no-match)
- `RetrieveStudentTests` — 2 tests (success, not found)
- `UpdateStudentTests` — 3 tests (PUT, PATCH, duplicate email)
- `DeleteStudentTests` — 2 tests (success, not found)

Run: `python manage.py test students --verbosity=2`

All 17 tests pass.

---

## 16. SECURITY

| Practice | Implementation |
|----------|---------------|
| No hardcoded secrets | All credentials in `.env` (via python-decouple) |
| .env not committed | Listed in `.gitignore` |
| SQL injection prevention | Django ORM with parameterised queries |
| Input validation | Both client-side and server-side |
| CORS restriction | Only `localhost:5173` allowed in development |
| Django `SECRET_KEY` | Loaded from environment variable |
| `DEBUG=False` in production | Controlled via `.env` |

---

## 17. GIT / VERSION CONTROL

The project uses Git for version control with meaningful commit history:

```bash
git init
git add .
git commit -m "Initial project setup: Student Management System"
git commit -m "Create Django backend with MySQL configuration"
git commit -m "Create Student model and migration"
git commit -m "Add DRF serializer with full validation"
git commit -m "Add REST API views (CRUD + search)"
git commit -m "Create React frontend with Vite"
git commit -m "Implement StudentForm component (create/edit)"
git commit -m "Implement StudentTable with edit and delete"
git commit -m "Add search, modal, and toast components"
git commit -m "Connect React frontend to Django REST API"
git commit -m "Add automated backend test suite (17 tests)"
git commit -m "Add responsive design for mobile/tablet"
git commit -m "Add complete project documentation"
```

---

## 18. RESULT

The Student Management System was successfully developed and tested. The following results were achieved:

✅ **All 17 automated tests pass**  
✅ **All 7 REST API endpoints working correctly**  
✅ **Real MySQL database integration confirmed**  
✅ **Full CRUD operations functional end-to-end**  
✅ **Search working across name, email, and department**  
✅ **Client-side + server-side validation implemented**  
✅ **Responsive design verified on desktop and mobile**  
✅ **Error states (network, 404, 400, 500) handled gracefully**  
✅ **No secrets committed to version control**  
✅ **Complete documentation produced**

---

## 19. CHALLENGES AND SOLUTIONS

| Challenge | Solution |
|-----------|----------|
| CORS errors between React (port 5173) and Django (port 8000) | Configured `django-cors-headers` in settings + Vite dev proxy |
| Duplicate email on edit (student's own email triggers unique constraint) | Serializer `validate_email` excludes current instance's pk on updates |
| Form state not resetting after cancel | `useEffect` watching `editingStudent` prop resets form to `EMPTY_FORM` |
| Phone validation too strict | Regex strips formatting chars (`+`, `-`, spaces) before digit check |
| API error messages not reaching form fields | Axios interceptor passes raw DRF errors; `mapServerErrors()` maps to fields |
| Django dev check warnings | All warnings are production-only (HTTPS/HSTS); dev mode is unaffected |

---

## 20. FUTURE ENHANCEMENTS

1. **Authentication** — JWT-based login for admin and teachers
2. **Role-based access** — Admin, teacher, student roles with different permissions
3. **Pagination** — Server-side pagination for large datasets
4. **Photo upload** — Student profile photo stored in media directory
5. **Course management** — Add Course and Enrollment tables
6. **Grade tracking** — Add marks/results linked to courses
7. **Export** — PDF and Excel export of student records
8. **Email notifications** — Automated emails on student creation/update
9. **Advanced search** — Filter by year, department, date range
10. **Dashboard analytics** — Charts for department distribution, year breakdown

---

## 21. CONCLUSION

The Student Management System successfully demonstrates a complete, working full-stack web application built following industry best practices. The project covers all phases of the Software Development Life Cycle: requirement analysis, system design, database design, backend API development, frontend UI development, integration, testing, and documentation.

The chosen technology stack — React, Django REST Framework, and MySQL — represents a production-grade combination used widely in the software industry. The project architecture maintains clear separation of concerns, making it maintainable and extensible.

All SOP requirements have been fulfilled: CRUD operations communicate with a real MySQL database through a REST API, dual-layer validation protects data integrity, automated tests cover all major scenarios, and the responsive design ensures accessibility across devices.

---

## REFERENCES

1. Django Documentation — https://docs.djangoproject.com/en/4.2/
2. Django REST Framework — https://www.django-rest-framework.org/
3. React Documentation — https://react.dev/
4. Vite Documentation — https://vitejs.dev/
5. Axios Documentation — https://axios-http.com/
6. MySQL 8.0 Reference Manual — https://dev.mysql.com/doc/
7. MDN Web Docs — https://developer.mozilla.org/
8. Python Documentation — https://docs.python.org/3/
