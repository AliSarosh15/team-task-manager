# TaskForge – Team Task Manager

TaskForge is a full-stack web application that allows teams to manage projects, assign tasks, and track progress with role-based access control.
Built as part of an assignment, this project demonstrates backend API development, frontend integration, authentication, and deployment.
---
## Live Demo

🔗 **Frontend:**(https://team-task-manager-ele06isaf-alisarosh15s-projects.vercel.app/)
🔗 **Backend API:**(https://web-production-f4deb.up.railway.app/)
🔗 **API Docs:**(https://web-production-f4deb.up.railway.app/docs#/)
---
## 📌 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Secure password hashing

### 👥 Role-Based Access

* **Admin**

  * Create projects
  * Assign tasks
* **Member**

  * View assigned tasks
  * Update task status

### 📁 Project Management

* Create projects
* Set deadlines
* Organize tasks under projects

### ✅ Task Management

* Create and assign tasks
* Update task status (Pending / Completed)
* Track deadlines

### 📊 Dashboard

* Total tasks
* Completed tasks
* Pending tasks
* Overdue tasks

---

## 🛠️ Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite / PostgreSQL
* JWT Authentication

### Frontend

* React (Vite)
* Fetch API

### Deployment

* Backend: Railway
* Frontend: Vercel

---

team-task-manager/
│
├── app/                     # 🔥 Backend (FastAPI)
│   ├── routes/
│   │   ├── dashboard.py
│   │   ├── project.py
│   │   ├── task.py
│   │   ├── user.py
│   │   ├── auth.py
│   │
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│
├── frontend/               # 🎨 Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── assets/
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│
├── .gitignore
├── README.md
├── Procfile
├── requirements.txt
├── runtime.txt

## ⚙️ Installation (Local Setup)

### 1️⃣ Clone the repo

```
git clone https://github.com/your-username/taskforge.git
cd taskforge
```

---

### 2️⃣ Backend Setup

```
cd app
python -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
uvicorn app.main:app --reload
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (Railway)

```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

### Frontend (Vercel)

```
VITE_API_URL=https://your-backend-url
```

---

## 📡 API Endpoints

### Auth

* `POST /auth/signup`
* `POST /auth/login`

### Projects

* `POST /projects/`
* `GET /projects/`

### Tasks

* `POST /tasks/`
* `GET /tasks/`
* `PUT /tasks/{id}`

### Dashboard

* `GET /dashboard/`

---

## 🧪 Test Data Example

```
{
  "username": "admin1",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

---

## 🚀 Deployment

### Backend

* Deployed on Railway
* Uses environment variables for DB connection

### Frontend

* Deployed on Vercel
* Connected to backend via API URL

---

## 🎥 Demo Video

📽️ (Add your 2–5 min demo video link here)

---

## 📌 Submission Checklist

* ✅ Live URL (Frontend + Backend)
* ✅ GitHub Repository
* ✅ README File
* ✅ Demo Video

---

## 👨‍💻 Author

Ali Sarosh
BTech CSE – Backend Developer (Python)

---

## 💡 Future Improvements

* Add notifications
* Add team collaboration features
* Improve UI/UX
* Add file attachments to tasks

---

## ⭐ Final Note

TaskForge is a complete team task management system demonstrating real-world backend and frontend integration with deployment.

---
