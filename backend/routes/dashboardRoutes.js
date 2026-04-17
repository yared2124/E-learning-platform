import express from "express";
import { authenticate, requireAuth } from "../middleware/auth.js";
import {
  studentDashboard,
  instructorDashboard,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authenticate);
router.get("/student", requireAuth, studentDashboard);
router.get("/instructor", requireAuth, instructorDashboard);

export default router;

