const express = require('express')

const router = express.Router()
const teacherController = require("../controller/techer.controller")

router.get("/", teacherController.getAllTeachers)
router.get("/:id", teacherController.getSingleTeacherDetails)

module.exports = router