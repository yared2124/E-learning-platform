import pool from "../config/db.js";

const Option = {
  create: async (questionId, optionText, isCorrect) => {
    const [result] = await pool.execute(
      "INSERT INTO Options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
      [questionId, optionText, isCorrect],
    );
    return result.insertId;
  },
  findByQuestion: async (questionId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Options WHERE question_id = ?",
      [questionId],
    );
    return rows;
  },
  findById: async (optionId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Options WHERE option_id = ?",
      [optionId],
    );
    return rows[0];
  },
  getCorrectOption: async (questionId) => {
    const [rows] = await pool.execute(
      "SELECT option_id FROM Options WHERE question_id = ? AND is_correct = TRUE",
      [questionId],
    );
    return rows[0];
  },
  delete: async (optionId) => {
    await pool.execute("DELETE FROM Options WHERE option_id = ?", [optionId]);
  },
};

export default Option;
