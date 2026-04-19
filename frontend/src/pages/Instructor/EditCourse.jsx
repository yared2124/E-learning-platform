import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../api/client";
import { Save, Trash2, BookOpen, FileQuestion } from "lucide-react";

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
      navigate("/dashboard/instructor");
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
        navigate("/dashboard/instructor");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="glass-card" style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Edit Course</h1>
        {error && (
          <p style={{ color: "#ff6b6b", marginBottom: "1rem" }}>{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="Thumbnail URL"
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <textarea
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            rows="3"
            placeholder="Syllabus"
            className="input-3d"
            style={{ width: "100%", marginBottom: "1.5rem" }}
          />
          <button
            type="submit"
            className="btn-3d"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Save size={18} /> Update Course
          </button>
        </form>

        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "1.5rem",
          }}
        >
          <h3>Course Content</h3>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Link
              to={`/instructor/lessons/${id}`}
              className="btn-3d"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <BookOpen size={18} /> Manage Lessons
            </Link>
            <Link
              to={`/instructor/manage-quiz/${id}`}
              className="btn-3d"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FileQuestion size={18} /> Manage Quizzes
            </Link>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "1.5rem",
          }}
        >
          <h3 style={{ color: "#ff6b6b" }}>Danger Zone</h3>
          <button
            onClick={handleDelete}
            className="btn-3d"
            style={{
              background: "#dc2626",
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Trash2 size={18} /> Delete Course Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
