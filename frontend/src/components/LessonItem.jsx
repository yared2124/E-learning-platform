import { CheckCircle, PlayCircle } from "lucide-react";

export default function LessonItem({ lesson, isEnrolled, onComplete }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: "1rem",
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PlayCircle size={20} /> {lesson.title}
        </h4>
        <a
          href={lesson.content_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.8rem", color: "#a777e3" }}
        >
          Watch video
        </a>
      </div>
      {isEnrolled && (
        <button
          onClick={onComplete}
          className="btn-3d"
          style={{ padding: "0.3rem 1rem" }}
        >
          <CheckCircle size={16} /> Complete
        </button>
      )}
    </div>
  );
}
