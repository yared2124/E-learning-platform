import pool from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import Option from "../models/Option.js";

dotenv.config();

const seed = async () => {
  try {
    // 1. Create admin user (if not exists)
    const adminEmail = "admin@example.com";
    let admin = await User.findByEmail(adminEmail);
    if (!admin) {
      const adminHash = await bcrypt.hash("admin123", 10);
      await pool.execute(
        "INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        ["Admin User", adminEmail, adminHash, "admin"],
      );
      console.log("✅ Admin user created: admin@example.com / admin123");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    // 2. Create instructor user (if not exists)
    const instructorEmail = "instructor@demo.com";
    let instructor = await User.findByEmail(instructorEmail);
    let instructorId;
    if (!instructor) {
      const instructorHash = await bcrypt.hash("pass123", 10);
      const [result] = await pool.execute(
        "INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        ["Demo Instructor", instructorEmail, instructorHash, "instructor"],
      );
      instructorId = result.insertId;
      console.log("✅ Instructor created: instructor@demo.com / pass123");
    } else {
      instructorId = instructor.user_id;
      console.log("ℹ️ Instructor already exists");
    }

    // 3. Create demo course (if not exists)
    const courseTitle = "JavaScript Basics";
    let course = (await Course.findOne)
      ? await Course.findOne(courseTitle)
      : null;
    // Use raw query to check existence by title and instructor
    const [existingCourse] = await pool.execute(
      "SELECT course_id FROM Courses WHERE title = ? AND instructor_id = ?",
      [courseTitle, instructorId],
    );
    let courseId;
    if (existingCourse.length === 0) {
      const [result] = await pool.execute(
        "INSERT INTO Courses (title, description, instructor_id, thumbnail, syllabus) VALUES (?, ?, ?, ?, ?)",
        [
          courseTitle,
          "Learn JavaScript from scratch",
          instructorId,
          "/images/js.jpg",
          "Intro, Variables, Functions",
        ],
      );
      courseId = result.insertId;
      console.log("✅ Demo course created");
    } else {
      courseId = existingCourse[0].course_id;
      console.log("ℹ️ Demo course already exists");
    }

    // 4. Add lessons (if not already present)
    const lessons = [
      { title: "Introduction", contentUrl: "https://youtu.be/demo1", order: 1 },
      { title: "Variables", contentUrl: "https://youtu.be/demo2", order: 2 },
    ];
    for (const lesson of lessons) {
      const [existingLesson] = await pool.execute(
        "SELECT lesson_id FROM Lessons WHERE course_id = ? AND title = ?",
        [courseId, lesson.title],
      );
      if (existingLesson.length === 0) {
        await pool.execute(
          "INSERT INTO Lessons (course_id, title, content_url, `order`) VALUES (?, ?, ?, ?)",
          [courseId, lesson.title, lesson.contentUrl, lesson.order],
        );
        console.log(`✅ Lesson "${lesson.title}" added`);
      } else {
        console.log(`ℹ️ Lesson "${lesson.title}" already exists`);
      }
    }

    // 5. Create quiz (if not exists)
    const quizTitle = "JS Basics Quiz";
    const [existingQuiz] = await pool.execute(
      "SELECT quiz_id FROM Quizzes WHERE course_id = ? AND title = ?",
      [courseId, quizTitle],
    );
    let quizId;
    if (existingQuiz.length === 0) {
      const [quizResult] = await pool.execute(
        "INSERT INTO Quizzes (course_id, title, passing_score, time_limit_minutes) VALUES (?, ?, ?, ?)",
        [courseId, quizTitle, 70, 10],
      );
      quizId = quizResult.insertId;
      console.log("✅ Quiz created");
    } else {
      quizId = existingQuiz[0].quiz_id;
      console.log("ℹ️ Quiz already exists");
    }

    // 6. Add question (if not exists)
    const questionText = "What does JS stand for?";
    const [existingQuestion] = await pool.execute(
      "SELECT question_id FROM Questions WHERE quiz_id = ? AND question_text = ?",
      [quizId, questionText],
    );
    let questionId;
    if (existingQuestion.length === 0) {
      const [qResult] = await pool.execute(
        "INSERT INTO Questions (quiz_id, question_text, question_type) VALUES (?, ?, ?)",
        [quizId, questionText, "mcq"],
      );
      questionId = qResult.insertId;
      console.log("✅ Question added");

      // Add options
      const options = [
        { text: "Java Source", correct: false },
        { text: "JavaScript", correct: true },
        { text: "Just Script", correct: false },
      ];
      for (const opt of options) {
        await pool.execute(
          "INSERT INTO Options (question_id, option_text, is_correct) VALUES (?, ?, ?)",
          [questionId, opt.text, opt.correct],
        );
      }
      console.log("✅ Options added");
    } else {
      console.log("ℹ️ Question already exists");
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
