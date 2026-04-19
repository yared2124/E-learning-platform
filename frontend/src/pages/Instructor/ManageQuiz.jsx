import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

export default function ManageQuiz() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizForm, setQuizForm] = useState({
    title: "",
    passing_score: 70,
    time_limit_minutes: null,
  });
  const [showQuizForm, setShowQuizForm] = useState(!quizId);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    question_type: "mcq",
    options: [{ option_text: "", is_correct: false }],
  });

  useEffect(() => {
    if (quizId) {
      // Load existing quiz
      api.quizzes.getById(quizId).then((res) => {
        setQuiz(res.quiz);
        setQuestions(res.questions || []);
        setQuizForm({
          title: res.quiz.title,
          passing_score: res.quiz.passing_score,
          time_limit_minutes: res.quiz.time_limit_minutes,
        });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [quizId]);

  const saveQuiz = async (e) => {
    e.preventDefault();
    try {
      if (quizId) {
        await api.quizzes.updateQuiz(quizId, quizForm);
      } else {
        const newQuiz = await api.quizzes.createQuiz({
          ...quizForm,
          course_id: courseId,
        });
        navigate(`/instructor/manage-quiz/${courseId}/${newQuiz.quizId}`);
      }
      setShowQuizForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        // update question + options
        await api.quizzes.updateQuestion(editingQuestion.question_id, {
          question_text: questionForm.question_text,
          question_type: questionForm.question_type,
        });
        // sync options (delete old, add new)
        // For simplicity, we'll assume you have an endpoint to replace options
        // Here we just reload
      } else {
        const newQ = await api.quizzes.addQuestion(quizId, {
          question_text: questionForm.question_text,
          question_type: questionForm.question_type,
        });
        for (const opt of questionForm.options) {
          await api.quizzes.addOption(newQ.questionId, {
            option_text: opt.option_text,
            is_correct: opt.is_correct,
          });
        }
      }
      // refresh questions
      const res = await api.quizzes.getById(quizId);
      setQuestions(res.questions);
      setQuestionForm({
        question_text: "",
        question_type: "mcq",
        options: [{ option_text: "", is_correct: false }],
      });
      setEditingQuestion(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteQuestion = async (qid) => {
    if (confirm("Delete question?")) {
      await api.quizzes.deleteQuestion(qid);
      const res = await api.quizzes.getById(quizId);
      setQuestions(res.questions);
    }
  };

  if (loading) return <div className="spinner" />;

  if (!quizId && !showQuizForm) {
    return (
      <div className="container">
        <button className="btn-3d" onClick={() => setShowQuizForm(true)}>
          Create New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: "2rem" }}>
        <h1>{quizId ? "Edit Quiz" : "Create Quiz"}</h1>
        {showQuizForm && (
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <form onSubmit={saveQuiz}>
              <input
                type="text"
                placeholder="Quiz Title"
                value={quizForm.title}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, title: e.target.value })
                }
                className="input-3d"
                style={{ width: "100%", marginBottom: "1rem" }}
                required
              />
              <input
                type="number"
                placeholder="Passing Score (%)"
                value={quizForm.passing_score}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, passing_score: e.target.value })
                }
                className="input-3d"
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <input
                type="number"
                placeholder="Time Limit (minutes, optional)"
                value={quizForm.time_limit_minutes || ""}
                onChange={(e) =>
                  setQuizForm({
                    ...quizForm,
                    time_limit_minutes: e.target.value || null,
                  })
                }
                className="input-3d"
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <button type="submit" className="btn-3d">
                Save Quiz
              </button>
            </form>
          </div>
        )}
      </div>

      {quizId && (
        <>
          <h2>Questions</h2>
          <button
            className="btn-3d"
            onClick={() => {
              setEditingQuestion(null);
              setQuestionForm({
                question_text: "",
                question_type: "mcq",
                options: [{ option_text: "", is_correct: false }],
              });
            }}
          >
            <Plus size={18} /> Add Question
          </button>

          {(editingQuestion ||
            (!editingQuestion && questionForm.question_text)) && (
            <div
              className="glass-card"
              style={{ padding: "1.5rem", margin: "1rem 0" }}
            >
              <h3>{editingQuestion ? "Edit Question" : "New Question"}</h3>
              <form onSubmit={addQuestion}>
                <input
                  type="text"
                  placeholder="Question Text"
                  value={questionForm.question_text}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      question_text: e.target.value,
                    })
                  }
                  className="input-3d"
                  style={{ width: "100%", marginBottom: "1rem" }}
                  required
                />
                <select
                  value={questionForm.question_type}
                  onChange={(e) =>
                    setQuestionForm({
                      ...questionForm,
                      question_type: e.target.value,
                    })
                  }
                  className="input-3d"
                  style={{ width: "100%", marginBottom: "1rem" }}
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="truefalse">True / False</option>
                </select>
                <h4>Options</h4>
                {questionForm.options.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Option text"
                      value={opt.option_text}
                      onChange={(e) => {
                        const newOpts = [...questionForm.options];
                        newOpts[idx].option_text = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOpts });
                      }}
                      className="input-3d"
                      style={{ flex: 1 }}
                    />
                    <label style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={opt.is_correct}
                        onChange={(e) => {
                          const newOpts = [...questionForm.options];
                          newOpts[idx].is_correct = e.target.checked;
                          setQuestionForm({
                            ...questionForm,
                            options: newOpts,
                          });
                        }}
                      />{" "}
                      Correct
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newOpts = questionForm.options.filter(
                          (_, i) => i !== idx,
                        );
                        setQuestionForm({ ...questionForm, options: newOpts });
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setQuestionForm({
                      ...questionForm,
                      options: [
                        ...questionForm.options,
                        { option_text: "", is_correct: false },
                      ],
                    })
                  }
                >
                  + Add Option
                </button>
                <div style={{ marginTop: "1rem" }}>
                  <button type="submit" className="btn-3d">
                    Save Question
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="course-grid">
            {questions.map((q) => (
              <div
                key={q.question_id}
                className="glass-card"
                style={{ padding: "1rem" }}
              >
                <p>
                  <strong>{q.question_text}</strong> ({q.question_type})
                </p>
                <ul>
                  {q.options?.map((opt) => (
                    <li key={opt.option_id}>
                      {opt.option_text} {opt.is_correct ? "✓" : ""}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setEditingQuestion(q);
                    setQuestionForm({
                      question_text: q.question_text,
                      question_type: q.question_type,
                      options: q.options || [],
                    });
                  }}
                >
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteQuestion(q.question_id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
