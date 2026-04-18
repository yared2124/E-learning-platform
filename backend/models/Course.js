import pool from "../config/db.js";

const Course = {
  findAll: async () => {
    const [rows] = await pool.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM Courses c 
      JOIN Users u ON c.instructor_id = u.user_id 
      ORDER BY c.created_at DESC
    `);
    return rows;
  },
  findById: async (courseId) => {
    const [rows] = await pool.execute(
      `
      SELECT c.*, u.name as instructor_name 
      FROM Courses c 
      JOIN Users u ON c.instructor_id = u.user_id 
      WHERE c.course_id = ?
    `,
      [courseId],
    );
    return rows[0];
  },
  findByInstructor: async (instructorId) => {
  const [rows] = await pool.execute('SELECT * FROM Courses WHERE instructor_id = ?', [instructorId]);
  return rows;
},
  create: async (title, description, instructorId, thumbnail, syllabus) => {
    const [result] = await pool.execute(
      "INSERT INTO Courses (title, description, instructor_id, thumbnail, syllabus) VALUES (?, ?, ?, ?, ?)",
      [title, description, instructorId, thumbnail, syllabus],
    );
    return result.insertId;
  },
  update: async (courseId, title, description, thumbnail, syllabus) => {
    await pool.execute(
      "UPDATE Courses SET title = ?, description = ?, thumbnail = ?, syllabus = ? WHERE course_id = ?",
      [title, description, thumbnail, syllabus, courseId],
    );
  },
  delete: async (courseId) => {
    await pool.execute("DELETE FROM Courses WHERE course_id = ?", [courseId]);
  },
};

export default Course;
