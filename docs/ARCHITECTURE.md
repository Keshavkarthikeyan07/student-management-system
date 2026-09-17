# 🏗️ Architecture — Student Management System

## Overview

The Student Management System follows a **3-tier, full-stack web architecture** with a clear separation between the presentation layer (React frontend), the business logic/API layer (Django REST Framework), and the data layer (MySQL database).

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  React Frontend (Vite)                  │   │
│  │                 http://localhost:5173                   │   │
│  │                                                         │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌────────────────┐  │   │
│  │  │  Dashboard │  │StudentForm  │  │  StudentTable  │  │   │
│  │  │   (page)   │  │ (create/    │  │ (list/edit/   │  │   │
│  │  │            │  │  edit)      │  │  delete)       │  │   │
│  │  └────────────┘  └─────────────┘  └────────────────┘  │   │
│  │                                                         │   │
│  │  ┌─────────────┐  ┌────────────┐  ┌────────────────┐  │   │
│  │  │  SearchBar  │  │   Modal    │  │     Toast      │  │   │
│  │  │  (search)   │  │ (confirm   │  │ (notifications)│  │   │
│  │  │             │  │  delete)   │  │                │  │   │
│  │  └─────────────┘  └────────────┘  └────────────────┘  │   │
│  │                                                         │   │
│  │           services/api.js (Axios)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP/REST (Vite proxy → Django)
                               │ Content-Type: application/json
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Django Backend (Python 3.10+)                   │
│                    http://127.0.0.1:8000                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Django REST Framework (DRF)                │   │
│  │                                                         │   │
│  │  config/urls.py                                         │   │
│  │       │                                                 │   │
│  │       ├── /api/students/     → student_list_create()   │   │
│  │       └── /api/students/{id}/→ student_detail()        │   │
│  │                                                         │   │
│  │  students/views.py  ←──  students/serializers.py       │   │
│  │       │                    (validation logic)           │   │
│  │       ▼                                                 │   │
│  │  students/models.py (Django ORM)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Middleware: CorsMiddleware, SecurityMiddleware, CSRF, Auth    │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Django ORM (SQL queries)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL 8.0+ Database                          │
│                 student_management_db                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                  students table                      │      │
│  │  id | name | email | phone | department | year |    │      │
│  │  created_at | updated_at                             │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Create Student (POST)

```
User fills form
      │
      ▼
Frontend validation (client-side)
      │
      ▼
axios.post('/api/students/', payload)
      │
      ▼  [Vite Dev Proxy forwards to Django]
      ▼
Django URL Router (config/urls.py)
      │
      ▼
student_list_create() view (students/views.py)
      │
      ▼
StudentSerializer.is_valid() — server-side validation
      │  ├── name, email, phone, department, year checks
      │  └── unique email check against DB
      │
      ▼
serializer.save() → Student.objects.create()
      │
      ▼
MySQL INSERT INTO students ...
      │
      ▼
Response: 201 Created + student JSON
      │
      ▼
React updates UI, shows success toast
```

### Read Students (GET)

```
Component mounts / search changes
      │
      ▼
axios.get('/api/students/?search=...')
      │
      ▼
Django: Student.objects.filter(Q(name) | Q(email) | Q(department))
      │
      ▼
MySQL SELECT * FROM students WHERE ...
      │
      ▼
Response: 200 OK + {count, results[]}
      │
      ▼
React renders StudentTable rows
```

---

## Component Architecture (Frontend)

```
App.jsx
├── Header.jsx              (sticky nav with student count badge)
├── ToastContainer.jsx      (notification queue — top-right)
└── main (Dashboard.jsx)
    ├── Stats bar           (Total, Departments, Highest Year, Search)
    ├── StudentForm.jsx     (add/edit — switches mode via props)
    ├── Toolbar
    │   ├── SearchBar.jsx   (debounced backend search)
    │   └── count label
    ├── Card
    │   └── StudentTable.jsx (table with Edit/Delete per row)
    └── Modal.jsx           (delete confirmation dialog)
```

---

## Technology Decisions

| Decision | Choice | Reason |
|---|---|---|
| API architecture | REST | Simple, well-understood, HTTP-native |
| Frontend framework | React 18 | Component-based, reactive state |
| Bundler | Vite 5 | Fast HMR, native ESM, built-in proxy |
| HTTP client | Axios | Interceptors for global error handling |
| Backend framework | Django 4.2 | Batteries-included, mature ORM |
| API layer | DRF 3.15 | Serializers, viewsets, validation |
| Database | MySQL 8.0 | Relational, ACID-compliant |
| Config management | python-decouple | 12-factor app env vars |
| CORS | django-cors-headers | Industry-standard |

---

## Security Architecture

```
┌──────────────────────────────────────────────────┐
│  Security Layers                                 │
│                                                  │
│  1. Environment Variables (.env)                 │
│     └── No secrets in source code               │
│                                                  │
│  2. Frontend Validation                          │
│     └── First line of defense (UX)              │
│                                                  │
│  3. CORS Middleware                              │
│     └── Only allow known origins (localhost)    │
│                                                  │
│  4. DRF Serializer Validation                   │
│     └── Server-side data validation             │
│                                                  │
│  5. Django ORM                                   │
│     └── Parameterised queries — no SQL injection│
│                                                  │
│  6. .gitignore                                   │
│     └── Never commit .env, venv, node_modules   │
└──────────────────────────────────────────────────┘
```

---

## Directory Structure

```
student-management-system/
│
├── .gitignore
├── README.md
│
├── backend/                        ← Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env                        ← Git-ignored, real credentials
│   ├── .env.example                ← Committed, shows structure
│   ├── venv/                       ← Git-ignored virtual env
│   │
│   ├── config/                     ← Django project config
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   └── students/                   ← Django app
│       ├── __init__.py
│       ├── models.py               ← Student model / ORM
│       ├── serializers.py          ← DRF serializer + validation
│       ├── views.py                ← API view functions
│       ├── urls.py                 ← App URL routing
│       ├── admin.py                ← Django admin config
│       ├── apps.py
│       ├── tests.py                ← 17 automated tests
│       └── migrations/
│           └── 0001_initial.py
│
├── frontend/                       ← React frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                ← React entry point
│       ├── App.jsx                 ← Root component (toasts, layout)
│       ├── index.css               ← Global design system
│       ├── components/
│       │   ├── Header.jsx          ← Sticky header + count badge
│       │   ├── StudentForm.jsx     ← Create/edit form
│       │   ├── StudentTable.jsx    ← Table with CRUD buttons
│       │   ├── SearchBar.jsx       ← Search input
│       │   ├── Modal.jsx           ← Delete confirmation
│       │   ├── Toast.jsx           ← Notification system
│       │   └── LoadingSpinner.jsx  ← Loading indicator
│       ├── pages/
│       │   └── Dashboard.jsx       ← Main page (orchestrates all)
│       └── services/
│           └── api.js              ← Axios API client
│
└── docs/
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── ARCHITECTURE.md             ← This file
    ├── DATABASE.md
    ├── TESTING.md
    └── PROJECT_REPORT.md
```
