import pool from "../config/db.js";

const Quiz = {
  create: async (courseId, title, passingScore, timeLimitMinutes) => {
    const [result] = await pool.execute(
      "INSERT INTO Quizzes (course_id, title, passing_score, time_limit_minutes) VALUES (?, ?, ?, ?)",
      [courseId, title, passingScore, timeLimitMinutes],
    );
    return result.insertId;
  },
  findByCourse: async (courseId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Quizzes WHERE course_id = ?",
      [courseId],
    );
    return rows;
  },
 findById: async (quizId) => {
  const [rows] = await pool.execute(`
    SELECT q.*, c.title as course_title, c.course_id
    FROM Quizzes q 
    JOIN Courses c ON q.course_id = c.course_id 
    WHERE q.quiz_id = ?
  `, [quizId]);
  return rows[0];
},
  update: async (quizId, title, passingScore, timeLimitMinutes) => {
    await pool.execute(
      "UPDATE Quizzes SET title = ?, passing_score = ?, time_limit_minutes = ? WHERE quiz_id = ?",
      [title, passingScore, timeLimitMinutes, quizId],
    );
  },
  delete: async (quizId) => {
    await pool.execute("DELETE FROM Quizzes WHERE quiz_id = ?", [quizId]);
  },
};

export default Quiz;
