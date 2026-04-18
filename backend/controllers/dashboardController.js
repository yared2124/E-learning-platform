import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";

export const studentDashboard = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.getEnrolledCourses(req.user.id);
    const progressList = [];
    for (let course of enrollments) {
      const prog = await Progress.getByUserAndCourse(
        req.user.id,
        course.course_id,
      );
      progressList.push({
        courseId: course.course_id,
        title: course.title,
        percentage: prog ? prog.completion_percentage : 0,
      });
    }
    res.json({ success: true, progressList });
  } catch (err) {
    next(err);
  }
};

export const instructorDashboard = async (req, res, next) => {
  try {
    const courses = await Course.findByInstructor(req.user.id);
    res.json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};
