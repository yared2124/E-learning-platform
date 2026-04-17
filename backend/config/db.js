import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "elearning",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected to database:", process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:");
    console.error("   - Error code:", err.code);
    console.error("   - Message:", err.message);
    console.error(
      "   - Check your .env credentials and ensure MySQL is running",
    );
    process.exit(1); // Exit if DB connection fails
  }
})();

export default pool;


