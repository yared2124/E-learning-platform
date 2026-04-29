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
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
