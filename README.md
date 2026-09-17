# 🎓 Student Management System

> **Full-stack CRUD web application** — React + Django REST Framework + MySQL

[![Python](https://img.shields.io/badge/Python-3.10+-blue)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2-green)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)](https://mysql.com)

---

## 📌 Project Overview

The Student Management System (SMS) is a complete full-stack web application that allows administrators to manage student records through a clean, responsive interface. Every operation — Create, Read, Update, Delete — communicates with a real **MySQL database** through a **Django REST API**.

```
React Frontend → REST API → Django REST Framework → Django ORM → MySQL
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| ➕ Add Student | Form with full client + server validation |
| 📋 View All Students | Live table pulled from MySQL |
| ✏️ Edit Student | Pre-filled form, real PUT request |
| 🗑️ Delete Student | Confirmation modal, real DELETE request |
| 🔍 Search | Debounced backend search (name, email, department) |
| ✅ Validation | Dual-layer: client-side + DRF server-side |
| 🔔 Notifications | Auto-dismissing success/error toasts |
| 📱 Responsive | Desktop, tablet, and mobile layouts |
| ⚡ Loading States | Spinner + empty state + error state |
| 🧪 Tests | 17 automated DRF test cases |

---

## 🛠️ Technology Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Frontend    | React 18, Vite, Axios, Vanilla CSS          |
| Backend     | Python 3.10+, Django 4.2, DRF 3.15         |
| Database    | MySQL 8.0+                                  |
| Config      | python-decouple (.env)                      |
| Version Ctrl| Git / GitHub                                |

---

## 🚀 Getting Started

### Prerequisites

Install these before starting:

| Tool | Download |
|------|----------|
| Python 3.10+ | https://python.org/downloads |
| Node.js 18+ | https://nodejs.org |
| MySQL 8.0+ | https://dev.mysql.com/downloads |
| Git | https://git-scm.com |

---

### Step 1 — MySQL Database Setup

Open MySQL command line and run:

```sql
CREATE DATABASE student_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: create a dedicated user
CREATE USER 'sms_user'@'localhost' IDENTIFIED BY 'YourPassword123!';
GRANT ALL PRIVILEGES ON student_management_db.* TO 'sms_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### Step 2 — Backend Setup

```bash
cd student-management-system/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
```

**Edit `.env`** with your MySQL credentials:

```env
SECRET_KEY=your-very-long-random-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=student_management_db
DB_USER=sms_user
DB_PASSWORD=YourPassword123!
DB_HOST=127.0.0.1
DB_PORT=3306

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

```bash
# Run database migrations (creates students table in MySQL)
python manage.py migrate

# (Optional) Create admin user for /admin panel
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

✅ Backend running at: **http://127.0.0.1:8000**

---

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd student-management-system/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint                    | Description          | Status Code |
|--------|-----------------------------|----------------------|-------------|
| GET    | `/api/students/`            | List all students    | 200         |
| GET    | `/api/students/?search=...` | Search students      | 200         |
| POST   | `/api/students/`            | Create student       | 201         |
| GET    | `/api/students/{id}/`       | Get one student      | 200         |
| PUT    | `/api/students/{id}/`       | Full update          | 200         |
| PATCH  | `/api/students/{id}/`       | Partial update       | 200         |
| DELETE | `/api/students/{id}/`       | Delete student       | 204         |

---

## 🧪 Running Tests

```bash
cd backend
venv\Scripts\activate      # Windows
python manage.py test students --verbosity=2
```

Expected: **17 tests, all OK**

---

## 📁 Project Structure

```
student-management-system/
├── .gitignore
├── README.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example         ← copy to .env and fill credentials
│   ├── config/
│   │   ├── settings.py
│   │   └── urls.py
│   └── students/
│       ├── models.py        ← Student ORM model
│       ├── serializers.py   ← DRF serializer + validation
│       ├── views.py         ← REST API views
│       ├── urls.py
│       ├── admin.py
│       └── tests.py         ← 17 automated tests
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/      ← Header, Form, Table, Search, Modal, Toast
│       ├── pages/           ← Dashboard
│       └── services/        ← Axios API client
└── docs/
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    ├── TESTING.md
    └── PROJECT_REPORT.md
```

---

## 🔐 Security Notes

- ❌ **Never** commit `.env` to Git (it's in `.gitignore`)
- ✅ Use a strong, unique `SECRET_KEY` (50+ random characters)
- ✅ Set `DEBUG=False` in production
- ✅ All SQL queries go through Django ORM (no raw SQL injection risk)

---

## 🌐 GitHub Setup

```bash
# Initialize Git (if not done)
git init

# Stage all files
git add .

# First commit
git commit -m "Initial project setup: Student Management System"

# Create a new repository at https://github.com/new
# Then connect your remote:
git remote add origin https://github.com/YOUR_USERNAME/student-management-system.git
git branch -M main
git push -u origin main
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | Full REST API reference + Postman guide |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture + data flow diagrams |
| [DATABASE.md](docs/DATABASE.md) | ER diagram + schema + SQL |
| [TESTING.md](docs/TESTING.md) | Test cases + how to run tests |
| [PROJECT_REPORT.md](docs/PROJECT_REPORT.md) | Complete college submission report |

---

## 📄 License

Created for educational / college submission purposes.
