const express = require('express')

const router = express.Router()
const teacherController = require("../controller/techer.controller")

const API_TOKEN = process.env.API_TOKEN || "12345677";
function authGuard(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== API_TOKEN) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
  next();
}

router.get("/", teacherController.getAllTeachers)
router.get("/:id", teacherController.getSingleTeacherDetails)

router.post("/add-new", authGuard, teacherController.addNewTeacher);

module.exports = router