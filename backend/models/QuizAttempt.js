import pool from "../config/db.js";

const QuizAttempt = {
  create: async (userId, quizId, score) => {
    const [result] = await pool.execute(
      "INSERT INTO QuizAttempts (user_id, quiz_id, score) VALUES (?, ?, ?)",
      [userId, quizId, score],
    );
    return result.insertId;
  },
  findByUserAndQuiz: async (userId, quizId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM QuizAttempts WHERE user_id = ? AND quiz_id = ? ORDER BY attempted_at DESC",
      [userId, quizId],
    );
    return rows;
  },
  findByUser: async (userId) => {
    const [rows] = await pool.execute(
      `
      SELECT qa.*, q.title as quiz_title, c.title as course_title 
      FROM QuizAttempts qa 
      JOIN Quizzes q ON qa.quiz_id = q.quiz_id 
      JOIN Courses c ON q.course_id = c.course_id 
      WHERE qa.user_id = ?
      ORDER BY qa.attempted_at DESC
    `,
      [userId],
    );
    return rows;
  },
};

export default QuizAttempt;
