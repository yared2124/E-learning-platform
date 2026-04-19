import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function Lessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    contentUrl: "",
    order: 0,
  });

  const fetchLessons = async () => {
    try {
      const res = await api.courses.getLessons(courseId);
      setLessons(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await api.courses.updateLesson(editingLesson.lesson_id, formData);
      } else {
        await api.courses.addLesson(courseId, formData);
      }
      setShowForm(false);
      setEditingLesson(null);
      setFormData({ title: "", contentUrl: "", order: 0 });
      fetchLessons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (lessonId) => {
    if (confirm("Delete this lesson?")) {
      await api.courses.deleteLesson(lessonId);
      fetchLessons();
    }
  };

  const startEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      contentUrl: lesson.content_url || "",
      order: lesson.order,
    });
    setShowForm(true);
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1>Manage Lessons</h1>
        <button
          className="btn-3d"
          onClick={() => {
            setShowForm(true);
            setEditingLesson(null);
            setFormData({ title: "", contentUrl: "", order: 0 });
          }}
        >
          <Plus size={18} /> Add Lesson
        </button>
      </div>

      {showForm && (
        <div
          className="glass-card"
          style={{ padding: "1.5rem", marginBottom: "2rem" }}
        >
          <h3>{editingLesson ? "Edit Lesson" : "New Lesson"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Lesson Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input-3d"
              style={{ width: "100%", marginBottom: "1rem" }}
              required
            />
            <input
              type="url"
              placeholder="Video URL (YouTube, etc.)"
              value={formData.contentUrl}
              onChange={(e) =>
                setFormData({ ...formData, contentUrl: e.target.value })
              }
              className="input-3d"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <input
              type="number"
              placeholder="Order (1,2,3...)"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              className="input-3d"
              style={{ width: "100%", marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="btn-3d">
                <Save size={16} /> Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLesson(null);
                }}
                className="btn-3d"
                style={{ background: "#666" }}
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="course-grid">
        {lessons.map((lesson) => (
          <div
            key={lesson.lesson_id}
            className="glass-card"
            style={{ padding: "1.5rem" }}
          >
            <h3>{lesson.title}</h3>
            <p>Order: {lesson.order}</p>
            <a
              href={lesson.content_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch
            </a>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => startEdit(lesson)}
                className="btn-3d"
                style={{ padding: "0.3rem 1rem" }}
              >
                <Edit size={16} /> Edit
              </button>
              <button
                onClick={() => handleDelete(lesson.lesson_id)}
                className="btn-3d"
                style={{ background: "#dc2626", padding: "0.3rem 1rem" }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
