import pool from "../config/db.js";
import bcrypt from "bcrypt";

const User = {
  create: async (name, email, password, role = "student") => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
    );
    return result.insertId;
  },
  findByEmail: async (email) => {
    const [rows] = await pool.execute("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
  findById: async (userId) => {
    const [rows] = await pool.execute(
      "SELECT user_id, name, email, role, created_at FROM Users WHERE user_id = ?",
      [userId],
    );
    return rows[0];
  },
  getAll: async () => {
    const [rows] = await pool.execute(
      "SELECT user_id, name, email, role, created_at FROM Users ORDER BY created_at DESC",
    );
    return rows;
  },
  updateRole: async (userId, role) => {
    await pool.execute("UPDATE Users SET role = ? WHERE user_id = ?", [
      role,
      userId,
    ]);
  },
  delete: async (userId) => {
    await pool.execute("DELETE FROM Users WHERE user_id = ?", [userId]);
  },
};

export default User;
