import pool from "../config/db.js";

const Question = {
  create: async (quizId, questionText, questionType) => {
    const [result] = await pool.execute(
      "INSERT INTO Questions (quiz_id, question_text, question_type) VALUES (?, ?, ?)",
      [quizId, questionText, questionType],
    );
    return result.insertId;
  },
  findByQuiz: async (quizId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Questions WHERE quiz_id = ?",
      [quizId],
    );
    return rows;
  },
  findById: async (questionId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Questions WHERE question_id = ?",
      [questionId],
    );
    return rows[0];
  },
  delete: async (questionId) => {
    await pool.execute("DELETE FROM Questions WHERE question_id = ?", [
      questionId,
    ]);
  },
};

export default Question;
