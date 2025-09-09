import { Router } from 'express';
import { getAllTeachers, getSingleTeacherDetails, addNewTeacher } from "../controller/techer.controller.js";

const router = Router()

const API_TOKEN = process.env.API_TOKEN || "12345677";
function authGuard(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== API_TOKEN) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  next();
}

router.get("/", getAllTeachers)
router.get("/:id", getSingleTeacherDetails)

router.post("/add-new", authGuard, addNewTeacher);

export default router