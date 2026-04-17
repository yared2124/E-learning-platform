import express from "express";
import { authenticate, requireAuth } from "../middleware/auth.js";
import { getQuiz, submitQuiz } from "../controllers/quizController.js";

const router = express.Router();

router.use(authenticate);
router.get("/:quizId", requireAuth, getQuiz);
router.post("/:quizId/submit", requireAuth, submitQuiz); // ✅ POST method

export default router;
