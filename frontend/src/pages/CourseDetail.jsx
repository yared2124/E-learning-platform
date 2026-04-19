import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api/client";
import LessonItem from "../components/LessonItem";

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
    fetchData(); // refresh to update progress (optional)
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container">
      <div
        className="glass-card"
        style={{ padding: "2rem", marginBottom: "2rem" }}
      >
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <p>Instructor: {course.instructor_name}</p>
        {!isEnrolled && user?.role === "student" && (
          <button
            onClick={handleEnroll}
            className="btn-3d"
            style={{ marginTop: "1rem" }}
          >
            Enroll Now
          </button>
        )}
        {isEnrolled && (
          <p style={{ marginTop: "1rem", color: "#a777e3" }}>✅ Enrolled</p>
        )}
      </div>
      <h2>Lessons</h2>
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson.lesson_id}
          lesson={lesson}
          isEnrolled={isEnrolled}
          onComplete={() => completeLesson(lesson.lesson_id)}
        />
      ))}
    </div>
  );
}
