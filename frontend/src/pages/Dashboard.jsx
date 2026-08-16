import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  ClipboardList,
  Edit,
  FileQuestion,
  GraduationCap,
  PlusCircle,
  Settings,
  Shield,
  Target,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      if (user.role === "admin") {
        setData({ success: true });
        return;
      }

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
        "Delete this course permanently? All lessons and enrollments will be removed.",
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

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (user.role === "student") {
    const progressList = data.progressList || [];
    const averageProgress =
      progressList.length > 0
        ? Math.round(
            progressList.reduce((acc, p) => acc + p.percentage, 0) /
              progressList.length,
          )
        : 0;
    const activeCourses = progressList.filter(
      (p) => p.percentage > 0 && p.percentage < 100,
    ).length;
    const completedCourses = progressList.filter(
      (p) => p.percentage === 100,
    ).length;

    return (
      <div className="container dashboard-page">
        <div className="dashboard-hero student-hero">
          <div className="dashboard-welcome">
            <div className="dashboard-avatar">
              <GraduationCap size={34} />
            </div>
            <div>
              <span className="eyebrow">Student workspace</span>
              <h1>Welcome back, {user.name}!</h1>
              <p>
                Pick up your lessons, finish active courses, and keep your
                learning momentum visible.
              </p>
            </div>
          </div>
          <Link to="/courses" className="btn-3d">
            Browse courses
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon cyan">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <h3>{progressList.length}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <h3>{activeCourses}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <Trophy size={24} />
            </div>
            <div className="stat-info">
              <h3>{completedCourses}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">
              <Target size={24} />
            </div>
            <div className="stat-info">
              <h3>{averageProgress}%</h3>
              <p>Avg. Progress</p>
            </div>
          </div>
        </div>

        {progressList.length === 0 ? (
          <div className="empty-dashboard glass-card">
            <BookOpen size={58} />
            <h3>No courses yet</h3>
            <p>Start your learning journey by enrolling in a course.</p>
            <Link to="/courses" className="btn-3d">
              Browse Courses
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="section-header dashboard-section-header">
              <div>
                <span className="eyebrow">Continue learning</span>
                <h2>Your courses</h2>
              </div>
            </div>
            <div className="course-grid">
              {progressList.map((p) => (
                <div key={p.courseId} className="glass-card progress-card">
                  <div className="progress-card-header">
                    <div className="course-token">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3>{p.title}</h3>
                      <p>
                        {p.percentage === 100
                          ? "Completed"
                          : "Ready for the next lesson"}
                      </p>
                    </div>
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
                  <Link
                    to={`/courses/${p.courseId}`}
                    className="btn-3d card-btn"
                  >
                    Continue Learning
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="container dashboard-page">
        <div className="dashboard-hero admin-hero">
          <div className="dashboard-welcome">
            <div className="dashboard-avatar">
              <Shield size={34} />
            </div>
            <div>
              <span className="eyebrow">Admin control center</span>
              <h1>Platform dashboard</h1>
              <p>
                Review learning operations, manage users, and keep the platform
                organized.
              </p>
            </div>
          </div>
          <Link to="/admin/users" className="btn-3d">
            Manage users
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="dashboard-stats admin-actions-grid">
          <Link to="/admin/users" className="stat-card admin-action-card">
            <div className="stat-icon amber">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Users</h3>
              <p>Assign roles and remove inactive accounts</p>
            </div>
          </Link>
          <Link to="/courses" className="stat-card admin-action-card">
            <div className="stat-icon cyan">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <h3>Courses</h3>
              <p>Browse the public learning catalog</p>
            </div>
          </Link>
          <Link
            to="/instructor/create-course"
            className="stat-card admin-action-card"
          >
            <div className="stat-icon purple">
              <PlusCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>Create</h3>
              <p>Add a new course as platform admin</p>
            </div>
          </Link>
        </div>

        <div className="dashboard-insights">
          <div className="glass-card insight-card">
            <ClipboardList size={28} />
            <h3>Role management</h3>
            <p>
              Promote students, assign instructors, and keep administrator
              access intentional.
            </p>
          </div>
          <div className="glass-card insight-card">
            <Settings size={28} />
            <h3>Operational view</h3>
            <p>
              Use the admin tools to keep learners, teachers, and course
              ownership clean.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const courses = data.courses || [];
  const totalEnrollments = courses.reduce(
    (acc, c) => acc + (c.enrollmentCount || 0),
    0,
  );
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessonCount || 0), 0);

  return (
    <div className="container dashboard-page">
      <div className="dashboard-hero instructor-hero">
        <div className="dashboard-welcome">
          <div className="dashboard-avatar">
            <BarChart3 size={34} />
          </div>
          <div>
            <span className="eyebrow">Teacher studio</span>
            <h1>Instructor Dashboard</h1>
            <p>
              Design lessons, manage quizzes, and watch student engagement grow.
            </p>
          </div>
        </div>
        <Link to="/instructor/create-course" className="btn-3d">
          <PlusCircle size={18} />
          New Course
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon cyan">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalEnrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <FileQuestion size={24} />
          </div>
          <div className="stat-info">
            <h3>{totalLessons}</h3>
            <p>Total Lessons</p>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-dashboard glass-card">
          <PlusCircle size={58} />
          <h3>No courses created</h3>
          <p>Create your first course and start teaching.</p>
          <Link to="/instructor/create-course" className="btn-3d">
            Create Your First Course
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className="section-header dashboard-section-header">
            <div>
              <span className="eyebrow">Course management</span>
              <h2>Your teaching library</h2>
            </div>
          </div>
          <div className="course-grid">
            {courses.map((course) => (
              <div
                key={course.course_id}
                className="glass-card course-manage-card"
              >
                <div className="course-manage-header">
                  <div className="course-token teacher">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.enrollmentCount || 0} students enrolled</p>
                  </div>
                </div>
                <p className="course-manage-desc">
                  {course.description
                    ? `${course.description.slice(0, 100)}${
                        course.description.length > 100 ? "..." : ""
                      }`
                    : "No course description yet."}
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
                    to={`/instructor/manage-quiz/${course.course_id}`}
                    className="btn-action"
                  >
                    <FileQuestion size={16} /> Quiz
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
        </>
      )}
    </div>
  );
}
