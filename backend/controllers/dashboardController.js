import Enrollment from "../models/Enrollment.js";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import { calculateCourseProgress } from "../services/progressCalculator.js";

export const studentDashboard = async (req, res) => {
  const enrollments = await Enrollment.getEnrolledCourses(req.user.id);
  const progressList = [];
  for (let course of enrollments) {
    let prog = await Progress.getByUserAndCourse(req.user.id, course.course_id);
    if (!prog) {
      const percentage = await calculateCourseProgress(
        req.user.id,
        course.course_id,
      );
      await Progress.update(req.user.id, course.course_id, percentage);
      prog = { completion_percentage: percentage };
    }
    progressList.push({ course, percentage: prog.completion_percentage });
  }
  res.render("dashboard/student", { progressList });
};

export const instructorDashboard = async (req, res) => {
  const courses = await Course.findByInstructor(req.user.id);
  res.render("dashboard/instructor", { courses });
};
