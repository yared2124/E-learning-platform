import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function Quiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.quizzes
      .getById(quizId)
      .then((res) => {
        setQuiz(res.quiz);
        setQuestions(res.questions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [quizId]);

  const handleAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    const res = await api.quizzes.submit(quizId, answers);
    setResult(res);
  };

  if (loading) return <div className="spinner"></div>;
  if (result) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "2rem" }}>
          <h2>Your Score: {result.score}%</h2>
          <p
            className={result.passed ? "success" : "fail"}
            style={{ fontSize: "1.5rem", margin: "1rem 0" }}
          >
            {result.passed ? "🎉 Passed!" : "❌ Failed. Try again."}
          </p>
          <a href="/dashboard" className="btn-3d">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!quiz) return <div className="container">Quiz not found</div>;

  return (
    <div className="container">
      <div className="glass-card" style={{ padding: "2rem" }}>
        <h1>{quiz.title}</h1>
        {questions.map((q, idx) => (
          <div
            key={q.question_id}
            style={{
              marginBottom: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "1rem",
            }}
          >
            <p>
              <strong>
                {idx + 1}. {q.question_text}
              </strong>
            </p>
            {q.options.map((opt) => (
              <label
                key={opt.option_id}
                style={{ display: "block", margin: "0.5rem 0" }}
              >
                <input
                  type="radio"
                  name={`q${q.question_id}`}
                  value={opt.option_id}
                  onChange={() => handleAnswer(q.question_id, opt.option_id)}
                />{" "}
                {opt.option_text}
              </label>
            ))}
          </div>
        ))}
        <button onClick={handleSubmit} className="btn-3d">
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
