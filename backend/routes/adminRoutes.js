import express from "express";
import { authenticate, requireAuth } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roleCheck.js";
import {
  listUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authenticate, requireAuth, allowRoles("admin"));
router.get("/users", listUsers);
router.post("/users/:id/role", updateUserRole);
router.post("/users/:id/delete", deleteUser);

export default router;
