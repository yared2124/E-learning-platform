import pool from "../config/db.js";

const LessonCompletion = {
  complete: async (userId, lessonId) => {
    const [existing] = await pool.execute(
      "SELECT * FROM LessonCompletion WHERE user_id = ? AND lesson_id = ?",
      [userId, lessonId],
    );
    if (existing.length > 0) return false;
    await pool.execute(
      "INSERT INTO LessonCompletion (user_id, lesson_id) VALUES (?, ?)",
      [userId, lessonId],
    );
    return true;
  },
  getCompletedLessons: async (userId, courseId) => {
    const [rows] = await pool.execute(
      `
      SELECT l.lesson_id 
      FROM LessonCompletion lc 
      JOIN Lessons l ON lc.lesson_id = l.lesson_id 
      WHERE lc.user_id = ? AND l.course_id = ?
    `,
      [userId, courseId],
    );
    return rows.map((row) => row.lesson_id);
  },
};

export default LessonCompletion;
