# 🚀 TaskForge – Team Task Manager

TaskForge is a full-stack Team Task Management web application that helps teams manage projects, assign tasks, and track progress with role-based access control.

Built using FastAPI and React, this project demonstrates real-world backend API development, frontend integration, authentication, database management, and cloud deployment.

---

# 🌐 Live Demo

## 🔗 Frontend
https://team-task-manager-ele06isaf-alisarosh15s-projects.vercel.app/

## 🔗 Backend API
https://web-production-f4deb.up.railway.app/

## 🔗 API Documentation
https://web-production-f4deb.up.railway.app/docs#/

## 🎥 Demo Video
https://drive.google.com/file/d/1YDqKHkqT4i8Unim4pGX2SzLVlR1DVBco/view?usp=drivesdk

---

# 📌 Features

---

## 🔐 Authentication

- User Signup & Login
- JWT-based Authentication
- Secure Password Hashing
- Protected API Routes

---

## 👥 Role-Based Access Control

### Admin
- Create Projects
- Assign Tasks
- Manage Team Workflow

### Member
- View Assigned Tasks
- Update Task Status
- Track Progress

---

## 📁 Project Management

- Create Projects
- Organize Tasks
- Set Project Deadlines
- Manage Team Activities

---

## ✅ Task Management

- Create Tasks
- Assign Tasks to Team Members
- Update Task Status
- Track Deadlines
- Mark Tasks as Completed

---

## 📊 Dashboard

- Total Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks
- Task Overview Analytics

---

# 🛠️ Tech Stack

---

## ⚙️ Backend

- FastAPI
- SQLAlchemy
- SQLite / PostgreSQL
- JWT Authentication
- Pydantic

---

## 🎨 Frontend

- React (Vite)
- Fetch API
- CSS

---

## ☁️ Deployment

### Backend
- Railway

### Frontend
- Vercel

---

# 📂 Project Structure

```text
taskforge/
│
├── app/                         # 🔥 Backend (FastAPI)
│   │
│   ├── routes/
│   │   ├── dashboard.py
│   │   ├── project.py
│   │   ├── task.py
│   │   ├── user.py
│   │   └── auth.py
│   │
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── frontend/                    # 🎨 Frontend (React + Vite)
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── assets/
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
├── Procfile
├── requirements.txt
└── runtime.txt
```

---

# ⚙️ Installation (Local Setup)

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/taskforge.git

cd taskforge
```

---

## 2️⃣ Backend Setup

```bash
cd app

python -m venv .venv
```

### Activate Virtual Environment

#### Linux / MacOS

```bash
source .venv/bin/activate
```

#### Windows

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r ../requirements.txt
```

### Run Backend Server

```bash
uvicorn app.main:app --reload
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

---

## Backend (Railway)

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

---

## Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-url
```

---

# 📡 API Endpoints

---

## 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register User |
| POST | `/auth/login` | User Login |

---

## 📁 Projects

| Method | Endpoint | Description |
|---|---|---|
| POST | `/projects/` | Create Project |
| GET | `/projects/` | Get Projects |

---

## ✅ Tasks

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks/` | Create Task |
| GET | `/tasks/` | Get Tasks |
| PUT | `/tasks/{id}` | Update Task |

---

## 📊 Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/` | Dashboard Statistics |

---

# 🧪 Test Data Example

```json
{
  "username": "admin1",
  "email": "admin@example.com",
  "password": "123456",
  "role": "admin"
}
```

---

# 🚀 Deployment

---

## ☁️ Backend Deployment

- Deployed on Railway
- Uses environment variables for secure configuration
- PostgreSQL database integration

---

## 🌐 Frontend Deployment

- Deployed on Vercel
- Connected with FastAPI backend using API URLs

---

# 📈 Key Learnings

This project helped in understanding:

- REST API Development
- Authentication & Authorization
- JWT Security
- Database Relationships
- Frontend & Backend Integration
- Deployment Workflow
- Full-Stack Project Structure

---

# 💡 Future Improvements

- 🔔 Notifications System
- 👥 Team Collaboration Features
- 📎 File Attachments
- 📅 Calendar Integration
- 📊 Advanced Analytics Dashboard
- 🎨 Improved UI/UX
- 📱 Mobile Responsive Enhancements

---

# 🤝 Contributing

Contributions are welcome.

## Steps

```bash
Fork → Clone → Create Branch → Commit → Push → Pull Request
```

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Ali Sarosh

🎓 BTech CSE Student  
💻 Backend Developer (Python)  
🚀 Open Source Contributor  

### Interests
- Backend Development
- FastAPI & Flask
- SQLAlchemy
- Full-Stack Development
- Machine Learning
- Open Source

---

## 🔗 Connect With Me

### GitHub
https://github.com/AliSarosh15

### LinkedIn
http://www.linkedin.com/in/ali-sarosh-332b90280/

---

# ⭐ Support

If you found this project useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🧠 Share feedback & suggestions

---

# 📌 Final Note

TaskForge is a complete full-stack project demonstrating real-world backend and frontend integration using FastAPI, React, JWT authentication, databases, and cloud deployment.
