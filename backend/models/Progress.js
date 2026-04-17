import pool from "../config/db.js";

const Progress = {
  update: async (userId, courseId, percentage) => {
    await pool.execute(
      `INSERT INTO Progress (user_id, course_id, completion_percentage) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE completion_percentage = ?, last_updated = CURRENT_TIMESTAMP`,
      [userId, courseId, percentage, percentage],
    );
  },
  getByUserAndCourse: async (userId, courseId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Progress WHERE user_id = ? AND course_id = ?",
      [userId, courseId],
    );
    return rows[0];
  },
  getByUser: async (userId) => {
    const [rows] = await pool.execute(
      `
      SELECT p.*, c.title as course_title 
      FROM Progress p 
      JOIN Courses c ON p.course_id = c.course_id 
      WHERE p.user_id = ?
    `,
      [userId],
    );
    return rows;
  },
};

export default Progress;

