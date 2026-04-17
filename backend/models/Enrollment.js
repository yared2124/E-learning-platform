import pool from "../config/db.js";

const Enrollment = {
  enroll: async (userId, courseId) => {
    const [existing] = await pool.execute(
      "SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?",
      [userId, courseId],
    );
    if (existing.length > 0) return false;
    await pool.execute(
      "INSERT INTO Enrollments (user_id, course_id) VALUES (?, ?)",
      [userId, courseId],
    );
    return true;
  },
  isEnrolled: async (userId, courseId) => {
    const [rows] = await pool.execute(
      "SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?",
      [userId, courseId],
    );
    return rows.length > 0;
  },
  getEnrolledCourses: async (userId) => {
    const [rows] = await pool.execute(
      `
      SELECT c.*, u.name as instructor_name 
      FROM Enrollments e 
      JOIN Courses c ON e.course_id = c.course_id 
      JOIN Users u ON c.instructor_id = u.user_id 
      WHERE e.user_id = ?
    `,
      [userId],
    );
    return rows;
  },
  getStudentsByCourse: async (courseId) => {
    const [rows] = await pool.execute(
      `
      SELECT u.user_id, u.name, u.email 
      FROM Enrollments e 
      JOIN Users u ON e.user_id = u.user_id 
      WHERE e.course_id = ?
    `,
      [courseId],
    );
    return rows;
  },
};

export default Enrollment;
