import pool from "../config/db.js";

const Lesson = {
  create: async (courseId, title, contentUrl, order) => {
    const [result] = await pool.execute(
      "INSERT INTO Lessons (course_id, title, content_url, `order`) VALUES (?, ?, ?, ?)",
      [courseId, title, contentUrl, order],
    );
    return result.insertId;
  },
  findByCourse: async (courseId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Lessons WHERE course_id = ? ORDER BY `order` ASC",
      [courseId],
    );
    return rows;
  },
  findById: async (lessonId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Lessons WHERE lesson_id = ?",
      [lessonId],
    );
    return rows[0];
  },
  update: async (lessonId, title, contentUrl, order) => {
    await pool.execute(
      "UPDATE Lessons SET title = ?, content_url = ?, `order` = ? WHERE lesson_id = ?",
      [title, contentUrl, order, lessonId],
    );
  },
  delete: async (lessonId) => {
    await pool.execute("DELETE FROM Lessons WHERE lesson_id = ?", [lessonId]);
  },
};

export default Lesson;
