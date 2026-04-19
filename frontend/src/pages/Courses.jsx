import { useEffect, useState } from "react";
import { api } from "../api/client";
import CourseCard from "../components/CourseCard";

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
      <h1>All Courses</h1>
      <div className="course-grid">
        {courses.map((course) => (
          <CourseCard key={course.course_id} course={course} />
        ))}
      </div>
    </div>
  );
}
