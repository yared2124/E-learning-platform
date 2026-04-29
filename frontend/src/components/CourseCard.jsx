import { Link } from "react-router-dom";
import { BookOpen, User, Clock, ArrowRight } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="glass-card course-card">
      <div className="card-glow"></div>
      <div className="card-icon">
        <BookOpen size={36} />
      </div>
      <h3 className="card-title">{course.title}</h3>
      <p className="card-description">{course.description?.slice(0, 100)}...</p>
      <div className="card-meta">
        <div className="meta-item">
          <User size={16} />
          <span>{course.instructor_name}</span>
        </div>
      </div>
      <Link to={`/courses/${course.course_id}`} className="btn-3d card-btn">
        View Course
        <ArrowRight size={18} style={{ marginLeft: "8px" }} />
      </Link>
    </div>
  );
}
