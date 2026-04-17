import express from "express";
import { authenticate, requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleCheck.js";
import {
  listCourses,
  getCourse,
  enroll,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import {
  addLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/lessonController.js";
import { completeLesson } from "../controllers/progressController.js";

const router = express.Router();

router.use(authenticate);
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/:id/enroll", requireAuth, allowRoles("student"), enroll);
router.post(
  "/:courseId/lessons",
  requireAuth,
  allowRoles("instructor", "admin"),
  addLesson,
);
router.put(
  "/lessons/:lessonId",
  requireAuth,
  allowRoles("instructor", "admin"),
  updateLesson,
);
router.delete(
  "/lessons/:lessonId",
  requireAuth,
  allowRoles("instructor", "admin"),
  deleteLesson,
);
router.post(
  "/:courseId/lessons/:lessonId/complete",
  requireAuth,
  allowRoles("student"),
  completeLesson,
); // ✅ this line
router.post("/", requireAuth, allowRoles("instructor", "admin"), createCourse);
router.put(
  "/:id",
  requireAuth,
  allowRoles("instructor", "admin"),
  updateCourse,
);
router.delete(
  "/:id",
  requireAuth,
  allowRoles("instructor", "admin"),
  deleteCourse,
);

export default router;
