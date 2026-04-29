import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FileQuestion,
  Clock,
  Target,
  ArrowLeft,
} from "lucide-react";

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
        <div className="page-header">
          <div className="page-header-content">
            <FileQuestion size={32} />
            <div>
              <h1>Quiz Management</h1>
              <p>Create and manage quizzes for your course</p>
            </div>
          </div>
          <button className="btn-3d" onClick={() => setShowQuizForm(true)}>
            <Plus size={18} /> Create New Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-header-content">
          <FileQuestion size={32} />
          <div>
            <h1>{quizId ? "Edit Quiz" : "Create Quiz"}</h1>
            <p>{quizId ? quiz.title : "Set up a new quiz for your course"}</p>
          </div>
        </div>
        {quizId && (
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back to Course
          </button>
        )}
      </div>

      {showQuizForm && (
        <div className="form-card">
          <div className="form-header">
            <Target size={24} />
            <h3>{quizId ? "Quiz Settings" : "Create New Quiz"}</h3>
          </div>
          <form onSubmit={saveQuiz}>
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                placeholder="Enter quiz title"
                value={quizForm.title}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, title: e.target.value })
                }
                className="input-3d"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  placeholder="70"
                  value={quizForm.passing_score}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, passing_score: e.target.value })
                  }
                  className="input-3d"
                />
              </div>
              <div className="form-group">
                <label>Time Limit (minutes)</label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={quizForm.time_limit_minutes || ""}
                  onChange={(e) =>
                    setQuizForm({
                      ...quizForm,
                      time_limit_minutes: e.target.value || null,
                    })
                  }
                  className="input-3d"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-3d">
                <Save size={18} /> Save Quiz
              </button>
              {quizId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowQuizForm(false)}
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {quizId && (
        <div className="content-section">
          <div className="section-header">
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
          </div>

          {(editingQuestion ||
            (!editingQuestion && questionForm.question_text)) && (
            <div className="form-card">
              <div className="form-header">
                <FileQuestion size={24} />
                <h3>{editingQuestion ? "Edit Question" : "New Question"}</h3>
              </div>
              <form onSubmit={addQuestion}>
                <div className="form-group">
                  <label>Question Text</label>
                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={questionForm.question_text}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question_text: e.target.value,
                      })
                    }
                    className="input-3d"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Question Type</label>
                  <select
                    value={questionForm.question_type}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        question_type: e.target.value,
                      })
                    }
                    className="input-3d"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="truefalse">True / False</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Answer Options</label>
                  <div className="options-list">
                    {questionForm.options.map((opt, idx) => (
                      <div key={idx} className="option-row">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={opt.option_text}
                          onChange={(e) => {
                            const newOpts = [...questionForm.options];
                            newOpts[idx].option_text = e.target.value;
                            setQuestionForm({
                              ...questionForm,
                              options: newOpts,
                            });
                          }}
                          className="input-3d"
                        />
                        <label className="correct-checkbox">
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
                          />
                          <span className="checkmark"></span>
                          Correct
                        </label>
                        <button
                          type="button"
                          className="btn-icon delete"
                          onClick={() => {
                            const newOpts = questionForm.options.filter(
                              (_, i) => i !== idx,
                            );
                            setQuestionForm({
                              ...questionForm,
                              options: newOpts,
                            });
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() =>
                      setQuestionForm({
                        ...questionForm,
                        options: [
                          ...questionForm.options,
                          { option_text: "", is_correct: false },
                        ],
                      })
                    }
                    style={{ marginTop: "0.5rem" }}
                  >
                    <Plus size={16} /> Add Option
                  </button>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-3d">
                    <Save size={18} /> Save Question
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setEditingQuestion(null);
                      setQuestionForm({
                        question_text: "",
                        question_type: "mcq",
                        options: [{ option_text: "", is_correct: false }],
                      });
                    }}
                  >
                    <X size={18} /> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="lessons-grid">
            {questions.map((q, index) => (
              <div
                key={q.question_id}
                className="lesson-manage-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="lesson-order">{index + 1}</div>
                <div className="lesson-manage-content">
                  <h3>{q.question_text}</h3>
                  <span className="lesson-video-link">
                    <FileQuestion size={14} />
                    {q.question_type === "mcq"
                      ? "Multiple Choice"
                      : "True/False"}{" "}
                    • {q.options?.length || 0} options
                  </span>
                </div>
                <div className="lesson-manage-actions">
                  <button
                    className="btn-icon edit"
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
                  <button
                    className="btn-icon delete"
                    onClick={() => deleteQuestion(q.question_id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="empty-state">
              <FileQuestion size={48} />
              <p>No questions yet. Add your first question above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
