import Lesson from "../models/Lesson.js";
import LessonCompletion from "../models/LessonCompletion.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";

export const calculateCourseProgress = async (userId, courseId) => {
  // Lessons progress
  const lessons = await Lesson.findByCourse(courseId);
  const completedLessons = await LessonCompletion.getCompletedLessons(
    userId,
    courseId,
  );
  const lessonProgress = lessons.length
    ? (completedLessons.length / lessons.length) * 100
    : 0;

  // Quizzes progress (average score of all quizzes in course)
  const quizzes = await Quiz.findByCourse(courseId);
  let quizProgress = 0;
  if (quizzes.length) {
    let totalScore = 0;
    for (const quiz of quizzes) {
      const attempts = await QuizAttempt.findByUserAndQuiz(
        userId,
        quiz.quiz_id,
      );
      if (attempts.length) {
        totalScore += attempts[0].score || 0;
      }
    }
    quizProgress = totalScore / quizzes.length;
  }

  // Weighted: 70% lessons, 30% quizzes (customizable)
  const overall = lessonProgress * 0.7 + quizProgress * 0.3;
  return Math.round(overall);
};
