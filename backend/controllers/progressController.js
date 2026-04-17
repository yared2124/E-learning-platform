import LessonCompletion from "../models/LessonCompletion.js";
import { calculateCourseProgress } from "../services/progressCalculator.js";
import Progress from "../models/Progress.js";

export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    await LessonCompletion.complete(req.user.id, lessonId);
    const percentage = await calculateCourseProgress(req.user.id, courseId);
    await Progress.update(req.user.id, courseId, percentage);
    res.json({ success: true, progress: percentage });
  } catch (err) {
    next(err);
  }
};
