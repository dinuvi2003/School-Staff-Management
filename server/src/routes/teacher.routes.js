import { Router } from "express";
import {
  getAllTeachers,
  getSingleTeacherDetails,
  addNewTeacher,
  deleteTeacher, 
} from "../handlers/controllers/teacherControllers/teacherController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const teacherRouter = Router();

teacherRouter.get("/", requireAuth, requireRole('ADMIN'), getAllTeachers);
teacherRouter.get("/:id", requireAuth, requireRole('ADMIN'), getSingleTeacherDetails);
teacherRouter.post("/add-new", requireAuth, requireRole('ADMIN'), addNewTeacher);
teacherRouter.delete("/:id", requireAuth, requireRole("ADMIN"), deleteTeacher);

export default teacherRouter;