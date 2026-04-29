import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/client";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  PlayCircle,
  ExternalLink,
} from "lucide-react";

export default function Lessons() {
  const { courseId } = useParams();
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
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="page-header">
        <div className="page-header-content">
          <PlayCircle size={40} />
          <div>
            <h1>Manage Lessons</h1>
            <p>{lessons.length} lessons in this course</p>
          </div>
        </div>
        <button
          className="btn-3d"
          onClick={() => {
            setShowForm(true);
            setEditingLesson(null);
            setFormData({ title: "", contentUrl: "", order: 0 });
          }}
        >
          <Plus size={18} />
          Add Lesson
        </button>
      </div>

      {showForm && (
        <div className="glass-card form-card">
          <h3>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</h3>
          <form onSubmit={handleSubmit} className="lesson-form">
            <div className="form-row">
              <div className="form-group">
                <label>Lesson Title</label>
                <input
                  type="text"
                  placeholder="Enter lesson title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input-3d"
                  required
                />
              </div>
              <div className="form-group small">
                <label>Order</label>
                <input
                  type="number"
                  placeholder="1"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="input-3d"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Video URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.contentUrl}
                onChange={(e) =>
                  setFormData({ ...formData, contentUrl: e.target.value })
                }
                className="input-3d"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-3d">
                <Save size={16} />
                {editingLesson ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLesson(null);
                }}
                className="btn-cancel"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {lessons.length === 0 ? (
        <div
          className="glass-card empty-state"
          style={{ padding: "3rem", textAlign: "center" }}
        >
          <PlayCircle
            size={64}
            style={{ color: "var(--primary-cyan)", marginBottom: "1rem" }}
          />
          <h3>No lessons yet</h3>
          <p>Add your first lesson to start building this course</p>
        </div>
      ) : (
        <div className="lessons-grid">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.lesson_id}
              className="glass-card lesson-manage-card"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="lesson-order">{lesson.order}</div>
              <div className="lesson-manage-content">
                <h3>{lesson.title}</h3>
                {lesson.content_url && (
                  <a
                    href={lesson.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lesson-video-link"
                  >
                    <ExternalLink size={14} />
                    Watch Video
                  </a>
                )}
              </div>
              <div className="lesson-manage-actions">
                <button
                  onClick={() => startEdit(lesson)}
                  className="btn-icon edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(lesson.lesson_id)}
                  className="btn-icon delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
