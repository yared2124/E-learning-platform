import { useEffect, useState } from "react";
import { api } from "../api/client";
import CourseCard from "../components/CourseCard";
import { BookOpen, Sparkles } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.courses.getAll().then((res) => {
      setCourses(res.courses);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container">
      <div className="hero">
        <div className="hero-icon">
          <BookOpen size={48} />
        </div>
        <h1>Explore Courses</h1>
        <p>
          Discover a world of knowledge with our expert-led courses. Start
          learning today and unlock your potential.
        </p>
      </div>

      <div className="courses-section">
        <div className="section-header">
          <h2>Available Courses</h2>
          <span className="course-count">{courses.length} courses</span>
        </div>

        <div className="course-grid">
          {courses.map((course, index) => (
            <div
              key={course.course_id}
              className="stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>No courses available yet</h3>
            <p>Check back soon for new courses!</p>
          </div>
        )}
      </div>
    </div>
  );
}
