// routes/teacher.routes.js
import { Router } from "express";
import {
  getAllTeachers,
  getSingleTeacherDetails,
  addNewTeacher,
} from "../handlers/controllers/teacherControllers/teacherController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireRole('ADMIN'), getAllTeachers);
router.get("/:id", requireAuth, requireRole('ADMIN'), getSingleTeacherDetails);
router.post("/add-new", requireAuth, requireRole('ADMIN'), addNewTeacher);

export default router;