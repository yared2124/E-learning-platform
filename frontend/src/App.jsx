import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Quiz from "./pages/Quiz";
import CreateCourse from "./pages/Instructor/CreateCourse";
import EditCourse from "./pages/Instructor/EditCourse";
import Lessons from "./pages/Instructor/Lessons";
import ManageQuiz from "./pages/Instructor/ManageQuiz";
import Users from "./pages/Admin/Users";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard route - MUST exist */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Student & common routes */}
        <Route path="/courses" element={<Courses />} />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        {/* Instructor routes */}
        <Route
          path="/instructor/create-course"
          element={
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/edit-course/:id"
          element={
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
              <EditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/lessons/:courseId"
          element={
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/manage-quiz/:courseId/:quizId?"
          element={
            <ProtectedRoute allowedRoles={["instructor", "admin"]}>
              <ManageQuiz />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Courses />} />
      </Routes>
    </>
  );
}

export default App;
