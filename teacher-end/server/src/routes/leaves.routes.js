import { Router } from 'express'
const router = Router()
import { getAllLeaves, getSingleLeaveDetails, approveLeaveStatus, rejectLeaveStatus, cancleLeaveStatus, getLeavesByTeacherId, getPendingLeavesByTeacherId, getRejectLeavesByTeacherId } from "../controller/leave.controller.js"

router.get("/", getAllLeaves)
router.get("/:id", getSingleLeaveDetails)

router.get("/teacher/:id", getLeavesByTeacherId)
router.get("/teacher/:id/pending", getPendingLeavesByTeacherId)
router.get("/teacher/:id/rejected", getRejectLeavesByTeacherId)

router.patch("/:id/approve", approveLeaveStatus)
router.patch("/:id/reject", rejectLeaveStatus)
router.patch("/:id/cancel", cancleLeaveStatus)

export default router