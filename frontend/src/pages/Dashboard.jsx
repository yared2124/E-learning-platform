import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import {
  BarChart3,
  PlusCircle,
  Edit,
  Trash2,
  BookOpen,
  FileQuestion,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint =
        user.role === "student"
          ? api.dashboard.getStudent()
          : api.dashboard.getInstructor();
      const res = await endpoint;
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  const deleteCourse = async (courseId) => {
    if (
      confirm(
        "⚠️ Delete this course permanently? All lessons and enrollments will be removed.",
      )
    ) {
      try {
        await api.courses.delete(courseId);
        // Refresh dashboard after deletion
        fetchDashboard();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="spinner" />;
  if (error)
    return (
      <div className="container">
        <p style={{ color: "#ff6b6b" }}>{error}</p>
      </div>
    );

  if (user.role === "student") {
    return (
      <div className="container">
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BarChart3 /> Student Dashboard
        </h1>
        {!data.progressList || data.progressList.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: "2rem", textAlign: "center" }}
          >
            <p>You are not enrolled in any course yet.</p>
            <Link
              to="/courses"
              className="btn-3d"
              style={{ display: "inline-block", marginTop: "1rem" }}
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="course-grid">
            {data.progressList.map((p) => (
              <div
                key={p.courseId}
                className="glass-card"
                style={{ padding: "1.5rem" }}
              >
                <h3>{p.title}</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${p.percentage}%` }}
                  ></div>
                </div>
                <p>{p.percentage}% completed</p>
                <Link
                  to={`/courses/${p.courseId}`}
                  className="btn-3d"
                  style={{ display: "inline-block", marginTop: "1rem" }}
                >
                  Continue
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Instructor dashboard
  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h1>Instructor Dashboard</h1>
        <Link
          to="/instructor/create-course"
          className="btn-3d"
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <PlusCircle size={18} /> New Course
        </Link>
      </div>

      {!data.courses || data.courses.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <p>You haven't created any courses yet.</p>
          <Link
            to="/instructor/create-course"
            className="btn-3d"
            style={{ display: "inline-block", marginTop: "1rem" }}
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="course-grid">
          {data.courses.map((course) => (
            <div
              key={course.course_id}
              className="glass-card"
              style={{ padding: "1.5rem" }}
            >
              <h3>{course.title}</h3>
              <p style={{ opacity: 0.8 }}>
                {course.description?.slice(0, 100)}
              </p>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <Link
                  to={`/instructor/edit-course/${course.course_id}`}
                  className="btn-3d"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.8rem",
                  }}
                >
                  <Edit size={16} /> Edit
                </Link>
                <Link
                  to={`/instructor/lessons/${course.course_id}`}
                  className="btn-3d"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.8rem",
                  }}
                >
                  <BookOpen size={16} /> Lessons
                </Link>
                <Link
                  to={`/instructor/manage-quiz/${course.course_id}`}
                  className="btn-3d"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.8rem",
                  }}
                >
                  <FileQuestion size={16} /> Quizzes
                </Link>
                <button
                  onClick={() => deleteCourse(course.course_id)}
                  className="btn-3d"
                  style={{
                    background: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.3rem 0.8rem",
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
