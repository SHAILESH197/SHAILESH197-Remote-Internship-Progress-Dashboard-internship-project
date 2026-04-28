
# Remote Internship Progress Dashboard

A full-stack web application built using **FastAPI + React** that enables secure authentication and role-based access control for managing internship progress.

---

## Overview

This project is designed to simulate an **industrial internship tracking system**, where:

* Admin manages students and monitors progress
* Students track their tasks and reports
* Secure login system using JWT authentication
* Role-based dashboard rendering

---

##  Features

### Authentication System

* Secure login using **JWT (JSON Web Token)**
* Password hashing for data protection
* Token-based session management

###  Role-Based Access

* **Admin**

  * Access to admin dashboard
  * View overall system data
* **Student**

  * Personal dashboard
  * Track assigned tasks and progress

### Dashboard UI

* Clean and modern UI using React
* Sidebar navigation
* Dynamic stats (tasks, reports, progress)
* Progress tracking bar

### Security

* Admin creation restricted to database only
* No public admin registration
* Protected API routes

---

##  Tech Stack

### Frontend

* React (Vite)
* Axios (API calls)
* CSS (custom styling)

### Backend

* FastAPI
* SQLAlchemy (ORM)
* JWT Authentication (python-jose)
* Password Hashing (passlib)

### Database

* MySQL

---

## Project Structure

```
Remote-Internship-Dashboard/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── utils/
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

##  How to Run

###  Backend Setup

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

###  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## API Endpoints

| Endpoint          | Method | Description          |
| ----------------- | ------ | -------------------- |
| `/users/register` | POST   | Register new student |
| `/users/login`    | POST   | Login and get token  |
| `/users/profile`  | GET    | Get user profile     |
| `/users/admin`    | GET    | Admin-only route     |

---

##  Demo Flow

1. Login with assigned credentials
2. Dashboard loads based on role
3. Admin sees admin panel
4. Student sees personal progress
5. Token-based authentication verified

---

##  Security Implementation

* Passwords are hashed before storing
* JWT token contains:

  * user email
  * role
* Token required for protected routes
* Unauthorized access is blocked

---

## Future Enhancements

* Task management system
* Report submission module
* Real-time progress tracking
* Admin analytics dashboard
* Deployment (AWS / Render)

---

##  Author

**Shailesh Dwivedi**
B.Tech - Artificial Intelligence & Data Science

---

## License

This project is created for educational and internship purposes.
