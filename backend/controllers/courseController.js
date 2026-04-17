import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";

export const listCourses = async (req, res, next) => {
  try {
    const courses = await Course.findAll();
    res.json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    const lessons = await Lesson.findByCourse(course.course_id);
    const isEnrolled = req.user
      ? await Enrollment.isEnrolled(req.user.id, course.course_id)
      : false;
    res.json({ success: true, course, lessons, isEnrolled });
  } catch (err) {
    next(err);
  }
};

export const enroll = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    const enrolled = await Enrollment.enroll(userId, courseId);
    if (!enrolled) {
      return res
        .status(400)
        .json({ success: false, message: "Already enrolled" });
    }
    res.json({ success: true, message: "Enrolled successfully" });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail, syllabus } = req.body;
    const courseId = await Course.create(
      title,
      description,
      req.user.id,
      thumbnail,
      syllabus,
    );
    res.status(201).json({ success: true, courseId });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail, syllabus } = req.body;
    await Course.update(req.params.id, title, description, thumbnail, syllabus);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    await Course.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
