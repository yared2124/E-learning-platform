import pool from "../config/db.js";

const QuizAttemptDetail = {
  create: async (attemptId, questionId, selectedOptionId, isCorrect) => {
    await pool.execute(
      "INSERT INTO QuizAttemptDetails (attempt_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?)",
      [attemptId, questionId, selectedOptionId, isCorrect],
    );
  },
  findByAttempt: async (attemptId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM QuizAttemptDetails WHERE attempt_id = ?",
      [attemptId],
    );
    return rows;
  },
};

export default QuizAttemptDetail;
