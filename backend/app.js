import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Make user available in all views (will be set by auth middleware)
app.use((req, res, next) => {
  res.locals.user = null;
  next();
});

// ✅ Health check route (must be BEFORE errorHandler)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ✅ Routes 
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);


// Home page
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/api/test-db", async (req, res) => {
  const pool = (await import("./config/db.js")).default;
  const [rows] = await pool.query("SELECT COUNT(*) as count FROM Courses");
  res.json(rows);
});

// Global error handler (last)
app.use(errorHandler);

export default app;
