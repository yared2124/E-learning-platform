import { useEffect, useState } from "react";
import { api } from "../api/client";
import CourseCard from "../components/CourseCard";
import { ArrowRight, BookOpen, Sparkles, Trophy, Users } from "lucide-react";
import heroImage from "../assets/hero.png";

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
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} />
            Premium learning experience
          </span>
          <h1>Explore Courses</h1>
          <p>
            Discover expert-led courses, follow your progress, and move from
            lesson to lesson inside a refined learning workspace.
          </p>
          <div className="hero-actions">
            <a href="#course-catalog" className="btn-3d">
              View catalog
              <ArrowRight size={18} />
            </a>
            <span className="hero-note">{courses.length} courses available</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img src={heroImage} alt="" />
          <div className="hero-metric primary">
            <BookOpen size={18} />
            <span>Guided lessons</span>
          </div>
          <div className="hero-metric secondary">
            <Trophy size={18} />
            <span>Progress tracking</span>
          </div>
        </div>
      </div>

      <div className="courses-section" id="course-catalog">
        <div className="section-header">
          <div>
            <span className="eyebrow">
              <Users size={15} />
              Course catalog
            </span>
            <h2>Available Courses</h2>
          </div>
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
