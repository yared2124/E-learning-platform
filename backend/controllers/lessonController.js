import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";

export const addLesson = async (req, res, next) => {
  try {
    const { title, contentUrl, order } = req.body;
    const lessonId = await Lesson.create(
      req.params.courseId,
      title,
      contentUrl,
      order,
    );
    res.status(201).json({ success: true, lessonId });
  } catch (err) {
    next(err);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const { title, contentUrl, order } = req.body;
    await Lesson.update(req.params.lessonId, title, contentUrl, order);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    await Lesson.delete(req.params.lessonId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
