import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/client";
import LessonItem from "../components/LessonItem";
import {
  BookOpen,
  User,
  CheckCircle,
  ArrowRight,
  PlayCircle,
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.courses.getById(id).then((res) => {
      setCourse(res.course);
      setLessons(res.lessons);
      setIsEnrolled(res.isEnrolled);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    await api.courses.enroll(id);
    setIsEnrolled(true);
  };

  const completeLesson = async (lessonId) => {
    await api.courses.completeLesson(id, lessonId);
    fetchData();
  };

  if (loading) return <div className="spinner" />;

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  return (
    <div className="container">
      <div className="course-detail-header">
        <div className="course-detail-icon">
          <BookOpen size={48} />
        </div>
        <div className="course-detail-info">
          <h1>{course.title}</h1>
          <p className="course-detail-desc">{course.description}</p>
          <div className="course-detail-meta">
            <span className="meta-item">
              <User size={16} />
              {course.instructor_name}
            </span>
            <span className="meta-item">
              <PlayCircle size={16} />
              {lessons.length} Lessons
            </span>
            {isEnrolled && (
              <span className="meta-item enrolled">
                <CheckCircle size={16} />
                Enrolled
              </span>
            )}
          </div>
        </div>
      </div>

      {isEnrolled && (
        <div className="course-progress-card glass-card">
          <div className="progress-header">
            <h3>Your Progress</h3>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-bar large">
            <div
              className="progress-fill shimmer"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-detail">
            {completedCount} of {lessons.length} lessons completed
          </p>
        </div>
      )}

      {!isEnrolled && user?.role === "student" && (
        <div className="enroll-card glass-card">
          <div className="enroll-content">
            <h3>Start Learning Today</h3>
            <p>
              Enroll in this course to access all lessons and track your
              progress
            </p>
          </div>
          <button onClick={handleEnroll} className="btn-3d">
            Enroll Now
            <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </button>
        </div>
      )}

      <div className="lessons-section">
        <h2 className="section-title">
          <PlayCircle size={24} />
          Course Lessons
        </h2>
        {lessons.length === 0 ? (
          <div
            className="glass-card empty-state"
            style={{ padding: "3rem", textAlign: "center" }}
          >
            <BookOpen
              size={48}
              style={{ color: "var(--primary-cyan)", marginBottom: "1rem" }}
            />
            <h3>No lessons available yet</h3>
            <p>Check back later for course content</p>
          </div>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson, idx) => (
              <LessonItem
                key={lesson.lesson_id}
                lesson={lesson}
                isEnrolled={isEnrolled}
                onComplete={() => completeLesson(lesson.lesson_id)}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
