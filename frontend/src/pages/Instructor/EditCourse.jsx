import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../api/client";
import {
  Save,
  Trash2,
  BookOpen,
  FileQuestion,
  ArrowLeft,
  Image,
  FileText,
} from "lucide-react";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.courses
      .getById(id)
      .then((res) => {
        setTitle(res.course.title);
        setDescription(res.course.description);
        setThumbnail(res.course.thumbnail || "");
        setSyllabus(res.course.syllabus || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.courses.update(id, { title, description, thumbnail, syllabus });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "⚠️ Delete this course permanently? All lessons and enrollments will be removed.",
      )
    ) {
      try {
        await api.courses.delete(id);
        navigate("/dashboard");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <BookOpen size={40} />
          </div>
          <h1>Edit Course</h1>
          <p>Update your course details</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label>
              <BookOpen size={18} />
              Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-3d"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="input-3d"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Image size={18} />
              Thumbnail URL
            </label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input-3d"
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              Syllabus
            </label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              rows="3"
              placeholder="Outline the course topics"
              className="input-3d"
            />
          </div>

          <button type="submit" className="btn-3d btn-submit">
            <Save size={18} />
            Update Course
          </button>
        </form>

        <div className="content-section">
          <h3>Course Content</h3>
          <div className="content-actions">
            <Link to={`/instructor/lessons/${id}`} className="btn-3d">
              <BookOpen size={18} />
              Manage Lessons
            </Link>
            <Link to={`/instructor/manage-quiz/${id}`} className="btn-3d">
              <FileQuestion size={18} />
              Manage Quizzes
            </Link>
          </div>
        </div>

        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <p>Once you delete a course, there is no going back.</p>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={18} />
            Delete Course Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
