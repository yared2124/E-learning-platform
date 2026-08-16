import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Layers, User } from "lucide-react";

export default function CourseCard({ course }) {
  const description = course.description || "A structured course designed to help you build practical skills.";
  const shortDescription =
    description.length > 120 ? `${description.slice(0, 120)}...` : description;

  return (
    <div className="glass-card course-card">
      <div className="card-glow"></div>
      <div className="course-card-top">
        <div className="card-icon">
          <BookOpen size={28} />
        </div>
        <span className="course-level">Featured</span>
      </div>
      <h3 className="card-title">{course.title}</h3>
      <p className="card-description">{shortDescription}</p>
      <div className="card-meta">
        <div className="meta-item">
          <User size={16} />
          <span>{course.instructor_name || "Expert instructor"}</span>
        </div>
        <div className="meta-item">
          <Layers size={16} />
          <span>Self paced</span>
        </div>
      </div>
      <Link to={`/courses/${course.course_id}`} className="btn-3d card-btn">
        View Course
        <ArrowRight size={18} style={{ marginLeft: "8px" }} />
      </Link>
    </div>
  );
}
