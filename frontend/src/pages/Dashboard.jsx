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
  GraduationCap,
  Trophy,
  Target,
  ArrowRight,
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
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <GraduationCap size={40} />
            <div>
              <h1>Welcome back, {user.name}!</h1>
              <p>Continue your learning journey</p>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon cyan">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <h3>{data.progressList?.length || 0}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <Trophy size={24} />
            </div>
            <div className="stat-info">
              <h3>
                {data.progressList?.filter((p) => p.percentage === 100)
                  .length || 0}
              </h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pink">
              <Target size={24} />
            </div>
            <div className="stat-info">
              <h3>
                {data.progressList?.length > 0
                  ? Math.round(
                      data.progressList.reduce(
                        (acc, p) => acc + p.percentage,
                        0,
                      ) / data.progressList.length,
                    )
                  : 0}
                %
              </h3>
              <p>Avg. Progress</p>
            </div>
          </div>
        </div>

        {!data.progressList || data.progressList.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: "3rem", textAlign: "center" }}
          >
            <BookOpen
              size={64}
              style={{ color: "var(--primary-cyan)", marginBottom: "1rem" }}
            />
            <h3 style={{ marginBottom: "0.5rem" }}>No courses yet</h3>
            <p
              style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.6)" }}
            >
              Start your learning journey by enrolling in a course
            </p>
            <Link to="/courses" className="btn-3d">
              Browse Courses
              <ArrowRight size={18} style={{ marginLeft: "8px" }} />
            </Link>
          </div>
        ) : (
          <div className="course-grid">
            {data.progressList.map((p) => (
              <div key={p.courseId} className="glass-card progress-card">
                <div className="progress-card-header">
                  <BookOpen size={28} />
                  <h3>{p.title}</h3>
                </div>
                <div className="progress-info">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${p.percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {p.percentage}% Complete
                  </span>
                </div>
                <Link to={`/courses/${p.courseId}`} className="btn-3d card-btn">
                  Continue Learning
                  <ArrowRight size={18} style={{ marginLeft: "8px" }} />
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
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <BarChart3 size={40} />
          <div>
            <h1>Instructor Dashboard</h1>
            <p>Manage your courses and track student progress</p>
          </div>
        </div>
        <Link to="/instructor/create-course" className="btn-3d">
          <PlusCircle size={18} style={{ marginRight: "8px" }} />
          New Course
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon cyan">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{data.courses?.length || 0}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <FileQuestion size={24} />
          </div>
          <div className="stat-info">
            <h3>
              {data.courses?.reduce(
                (acc, c) => acc + (c.enrollmentCount || 0),
                0,
              ) || 0}
            </h3>
            <p>Total Enrollments</p>
          </div>
        </div>
      </div>

      {!data.courses || data.courses.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <PlusCircle
            size={64}
            style={{ color: "var(--primary-purple)", marginBottom: "1rem" }}
          />
          <h3 style={{ marginBottom: "0.5rem" }}>No courses created</h3>
          <p style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.6)" }}>
            Create your first course and start teaching
          </p>
          <Link to="/instructor/create-course" className="btn-3d">
            Create Your First Course
            <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </Link>
        </div>
      ) : (
        <div className="course-grid">
          {data.courses.map((course) => (
            <div
              key={course.course_id}
              className="glass-card course-manage-card"
            >
              <div className="course-manage-header">
                <BookOpen size={28} />
                <h3>{course.title}</h3>
              </div>
              <p className="course-manage-desc">
                {course.description?.slice(0, 80)}...
              </p>
              <div className="course-manage-meta">
                <span>{course.enrollmentCount || 0} students</span>
                <span>{course.lessonCount || 0} lessons</span>
              </div>
              <div className="course-manage-actions">
                <Link
                  to={`/instructor/edit-course/${course.course_id}`}
                  className="btn-action edit"
                >
                  <Edit size={16} /> Edit
                </Link>
                <Link
                  to={`/instructor/lessons/${course.course_id}`}
                  className="btn-action"
                >
                  Lessons
                </Link>
                <button
                  onClick={() => deleteCourse(course.course_id)}
                  className="btn-action delete"
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
