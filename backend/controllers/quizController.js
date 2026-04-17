import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Option from "../models/Option.js";
import Enrollment from "../models/Enrollment.js";
import { gradeQuiz } from "../services/quizGrading.js";
import QuizAttempt from "../models/QuizAttempt.js";
import QuizAttemptDetail from "../models/QuizAttemptDetail.js";

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });

    const enrolled = await Enrollment.isEnrolled(req.user.id, quiz.course_id);
    if (!enrolled)
      return res
        .status(403)
        .json({ success: false, message: "Not enrolled in this course" });

    const questions = await Question.findByQuiz(quiz.quiz_id);
    for (let q of questions) {
      q.options = await Option.findByQuestion(q.question_id);
    }
    res.json({ success: true, quiz, questions });
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });

    const answers = req.body.answers || {};
    const { score, details } = await gradeQuiz(
      quiz.quiz_id,
      answers,
      req.user.id,
    );
    const attemptId = await QuizAttempt.create(
      req.user.id,
      quiz.quiz_id,
      score,
    );

    for (let d of details) {
      await QuizAttemptDetail.create(
        attemptId,
        d.questionId,
        d.selectedOptionId,
        d.isCorrect,
      );
    }
    const passed = score >= quiz.passing_score;
    res.json({ success: true, score, passed, attemptId });
  } catch (err) {
    next(err);
  }
};
