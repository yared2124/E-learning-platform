import { CheckCircle, PlayCircle, Lock, Video } from "lucide-react";

export default function LessonItem({
  lesson,
  isEnrolled,
  onComplete,
  index = 0,
}) {
  return (
    <div
      className="glass-card lesson-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="lesson-number">{index + 1}</div>
      <div className="lesson-content">
        <div className="lesson-header">
          <PlayCircle size={22} className="lesson-icon" />
          <h4>{lesson.title}</h4>
        </div>
        {lesson.content_url ? (
          <a
            href={lesson.content_url}
            target="_blank"
            rel="noopener noreferrer"
            className="lesson-link"
          >
            <Video size={14} />
            Watch Video
          </a>
        ) : (
          <span className="lesson-link no-link">No video available</span>
        )}
      </div>
      <div className="lesson-actions">
        {isEnrolled ? (
          lesson.completed ? (
            <span className="completed-badge">
              <CheckCircle size={16} />
              Completed
            </span>
          ) : (
            <button onClick={onComplete} className="btn-3d btn-small">
              <CheckCircle size={14} />
              Mark Complete
            </button>
          )
        ) : (
          <span className="locked-badge">
            <Lock size={14} />
            Enroll to access
          </span>
        )}
      </div>
    </div>
  );
}
