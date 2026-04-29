import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/client";
import { PlusCircle, ArrowLeft, BookOpen, Image, FileText } from "lucide-react";

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
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <Link to="/dashboard" className="back-link">
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <PlusCircle size={40} />
          </div>
          <h1>Create New Course</h1>
          <p>Share your knowledge with the world</p>
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
              placeholder="Enter a compelling title for your course"
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
              placeholder="Describe what students will learn in this course"
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
              placeholder="https://example.com/image.jpg"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="input-3d"
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              Syllabus
            </label>
            <textarea
              placeholder="Outline the course topics and structure"
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              rows="3"
              className="input-3d"
            />
          </div>

          <button type="submit" className="btn-3d btn-submit">
            <PlusCircle size={18} />
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}
