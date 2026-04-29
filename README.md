
# 📚 E‑Learning Platform

A full‑featured e‑learning web application with **courses, quizzes, progress tracking**, role‑based access (student, instructor, admin), and a 3D‑styled frontend.

## ✨ Features

- **Authentication** – register, login, logout, JWT (stored in httpOnly cookie or localStorage)
- **Courses** – browse, view details, enroll (student); create, edit, delete (instructor)
- **Lessons** – add, edit, delete (instructor); mark as complete (student)
- **Quizzes** – auto‑graded MCQs / true‑false; passing score; attempt history
- **Progress tracking** – lesson completion + quiz score → overall percentage per course
- **Dashboards** – student (enrolled courses + progress), instructor (own courses)
- **Admin panel** – list users, change roles, delete users
- **Frontend** – React + Vite, 3D glassmorphism, responsive, Lucide icons

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**
- **MySQL** (with `mysql2` promise wrapper)
- **JWT** authentication (httpOnly cookies)
- **bcrypt** for password hashing
- **express‑validator** for input validation

### Frontend
- **React** (functional components + hooks)
- **Vite** (fast build tool)
- **React Router DOM** v6
- **Axios** (API calls)
- **Lucide React** (icons)
- **Custom CSS** (glassmorphism, 3D transforms, gradients)

## 📁 Project Structure

```
e-learning-platform/
├── backend/                 # Node.js + Express backend (MVC)
│   ├── config/              # DB connection, JWT config
│   ├── models/              # MySQL queries (User, Course, Lesson, Quiz, …)
│   ├── controllers/         # Business logic (JSON responses)
│   ├── routes/              # API endpoints (/api/...)
│   ├── middleware/          # auth, roleCheck, validation, errorHandler
│   ├── services/            # quizGrading, progressCalculator
│   ├── seed/                # seed.js (initial data)
│   ├── sql/                 # schema.sql
│   ├── .env
│   └── package.json
└── frontend/                # React + Vite frontend
    ├── public/
    ├── src/
    │   ├── api/             # axios client, API methods
    │   ├── contexts/        # AuthContext
    │   ├── components/      # Navbar, ProtectedRoute, CourseCard, …
    │   ├── pages/           # Login, Register, Dashboard, Courses, Quiz, Instructor pages, Admin
    │   ├── hooks/           # useAuth (optional)
    │   ├── utils/           # helpers
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css        # global 3D styles
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or newer)
- **MySQL** (v8 recommended)
- **npm** or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/e-learning-platform.git
cd e-learning-platform
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env        # create environment file
npm install
```

Edit `.env` with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=elearning
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Create the database and tables:
```bash
mysql -u root -p < sql/schema.sql
```

Seed the database (creates admin, instructor, demo course, quiz):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev          # runs on http://localhost:3000
```

### 3. Frontend setup

Open a new terminal, from the project root:
```bash
cd frontend
cp .env.example .env   # create .env
npm install
```

Edit `.env` (ensure it points to your backend):
```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend dev server:
```bash
npm run dev          # runs on http://localhost:5173
```

## 🔑 Default Login Credentials

| Role       | Email                     | Password  |
|------------|---------------------------|-----------|
| Admin      | `admin@example.com`       | `admin123` |
| Instructor | `instructor@demo.com`     | `pass123`  |
| Student    | (any newly registered user) | –        |

## 📡 API Endpoints (summary)

| Method | Endpoint                     | Access        | Description |
|--------|------------------------------|---------------|-------------|
| POST   | `/api/auth/register`         | public        | Register new student |
| POST   | `/api/auth/login`            | public        | Login, returns token |
| GET    | `/api/auth/me`               | authenticated | Get current user |
| POST   | `/api/auth/logout`           | authenticated | Logout |
| GET    | `/api/courses`               | authenticated | List all courses |
| GET    | `/api/courses/:id`           | authenticated | Course details + lessons |
| POST   | `/api/courses/:id/enroll`    | student only  | Enroll in course |
| POST   | `/api/courses`               | instructor    | Create a course |
| PUT    | `/api/courses/:id`           | instructor    | Update course |
| DELETE | `/api/courses/:id`           | instructor    | Delete course |
| POST   | `/api/courses/:id/lessons`   | instructor    | Add lesson |
| PUT    | `/api/lessons/:id`           | instructor    | Update lesson |
| DELETE | `/api/lessons/:id`           | instructor    | Delete lesson |
| POST   | `/api/courses/:id/lessons/:lid/complete` | student | Mark lesson complete |
| GET    | `/api/quizzes/:id`           | enrolled student | Get quiz + questions |
| POST   | `/api/quizzes/:id/submit`    | enrolled student | Submit answers |
| GET    | `/api/dashboard/student`     | student       | Enrolled courses + progress |
| GET    | `/api/dashboard/instructor`  | instructor    | List own courses |
| GET    | `/api/admin/users`           | admin         | List all users |
| PUT    | `/api/admin/users/:id/role`  | admin         | Change user role |
| DELETE | `/api/admin/users/:id`       | admin         | Delete user |

> Full Postman collection available in `/docs` (if you exported it).

## 🧪 Testing with Postman

1. Import the API endpoints (or manually test using the table above).
2. Use `POST /api/auth/login` to obtain a token.
3. For authenticated requests (except login/register), include the token in:
   - **Authorization header**: `Bearer <token>`  
   - or let the cookie be sent automatically (if using httpOnly cookies, ensure `credentials: 'include'`).

## 🎨 Frontend Screenshots

*(Add your own screenshots here)*

- Login / Register pages with glassmorphism
- Course catalog with 3D cards
- Student dashboard with progress bars
- Instructor dashboard with course management
- Quiz attempt page
- Admin user management table

## 🚧 Future Improvements

- File upload for course thumbnails (Multer)
- Email verification on registration (Nodemailer)
- Pagination for courses and users
- Rate limiting & security headers (helmet)
- Docker compose (backend + MySQL + frontend)

## 📄 License

MIT

## 👏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- 3D inspiration from modern glassmorphism designs


Save this as `README.md` in the root of your project (the same folder that contains `backend/` and `frontend/`). Adjust the repository URL and add your own screenshots if desired.
