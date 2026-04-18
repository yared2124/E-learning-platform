import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem" }}>
      <BookOpen
        size={32}
        style={{ marginBottom: "0.5rem", color: "#a777e3" }}
      />
      <h3>{course.title}</h3>
      <p style={{ opacity: 0.8, marginTop: "0.5rem" }}>
        {course.description?.slice(0, 80)}...
      </p>
      <p style={{ fontSize: "0.8rem", marginTop: "1rem" }}>
        Instructor: {course.instructor_name}
      </p>
      <Link
        to={`/courses/${course.course_id}`}
        className="btn-3d"
        style={{ display: "inline-block", marginTop: "1rem" }}
      >
        View Course
      </Link>
    </div>
  );
}
