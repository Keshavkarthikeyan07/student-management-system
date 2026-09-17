# 🎓 Student Management System

> **Full-stack CRUD web application** built with React, Django REST Framework, and MySQL.

---

## 📌 Project Overview

The Student Management System (SMS) is a complete full-stack web application that allows administrators to manage student records through a clean, responsive interface. It demonstrates the complete data flow:

```
React Frontend → REST API → Django REST Framework → Django ORM → MySQL Database
```

---

## 🛠️ Technology Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Frontend    | React 18, Vite, JavaScript, Axios, CSS    |
| Backend     | Python 3.10+, Django 4.2, DRF 3.15        |
| Database    | MySQL 8.0+                                |
| Environment | python-decouple (.env)                    |
| Version Ctrl| Git / GitHub                              |

---

## 🚀 Quick Start

### Prerequisites

1. **Python 3.10+** — [python.org](https://python.org)
2. **Node.js 18+** — [nodejs.org](https://nodejs.org)
3. **MySQL 8.0+** — [mysql.com](https://mysql.com)
4. **Git** — [git-scm.com](https://git-scm.com)

---

### 🗃️ Step 1: MySQL Database Setup

```sql
-- Run in MySQL client
CREATE DATABASE student_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sms_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON student_management_db.* TO 'sms_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### ⚙️ Step 2: Backend Setup

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

# Copy env file
copy .env.example .env

# Edit .env with your MySQL credentials
notepad .env
```

**Edit `.env`:**
```env
SECRET_KEY=generate-a-new-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=student_management_db
DB_USER=sms_user
DB_PASSWORD=your_secure_password
DB_HOST=127.0.0.1
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

```bash
# Run migrations (creates the students table in MySQL)
python manage.py migrate

# Create a superuser (optional, for /admin)
python manage.py createsuperuser

# Start the backend
python manage.py runserver
```

Backend will be available at: **http://127.0.0.1:8000**

---

### 🖥️ Step 3: Frontend Setup

```bash
cd student-management-system/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/students/`       | List all students      |
| GET    | `/api/students/?search=` | Search students      |
| POST   | `/api/students/`       | Create student         |
| GET    | `/api/students/{id}/`  | Get single student     |
| PUT    | `/api/students/{id}/`  | Full update            |
| PATCH  | `/api/students/{id}/`  | Partial update         |
| DELETE | `/api/students/{id}/`  | Delete student         |

---

## ✨ Features

- ✅ Add, view, edit, delete students
- ✅ Real-time search (name, email, department)
- ✅ Client-side + server-side validation
- ✅ Success/error toast notifications
- ✅ Delete confirmation modal
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading, empty, and error states
- ✅ Django Admin panel
- ✅ Automated test suite

---

## 🧪 Running Tests

```bash
cd backend
python manage.py test students
```

---

## 🔐 Security Notes

- Never commit `.env` to Git
- Use strong, unique `SECRET_KEY`
- Set `DEBUG=False` in production
- Use environment variables for all credentials

---

## 📁 Project Structure

```
student-management-system/
├── .gitignore
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── students/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── tests.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       ├── pages/
│       └── services/
└── docs/
    ├── API_DOCUMENTATION.md
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    ├── TESTING.md
    └── PROJECT_REPORT.md
```

---

## 🌐 GitHub Setup

```bash
# Initialize Git (if not done)
git init

# Add all files
git add .

# First commit
git commit -m "Initial project setup: Student Management System"

# Create a GitHub repository at https://github.com/new
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/student-management-system.git
git branch -M main
git push -u origin main
```

---

## 📄 License

This project is created for educational/college submission purposes.
