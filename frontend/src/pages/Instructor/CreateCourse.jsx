import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.courses.create({ title, description, thumbnail, syllabus });
      navigate("/dashboard/instructor");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="glass-card" style={{ padding: "2rem" }}>
        <h2>Create New Course</h2>
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />
          <input
            type="text"
            placeholder="Thumbnail URL"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <textarea
            placeholder="Syllabus"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            rows="3"
            className="input-3d"
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <button type="submit" className="btn-3d">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}
