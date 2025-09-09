import { Router } from 'express'
const router = Router()
import { getAllLeaves, getSingleLeaveDetails, approveLeaveStatus, rejectLeaveStatus, cancleLeaveStatus } from "../controller/leave.controller.js"

router.get("/", getAllLeaves)
router.get("/:id", getSingleLeaveDetails)
router.patch("/:id/approve", approveLeaveStatus)
router.patch("/:id/reject", rejectLeaveStatus)
router.patch("/:id/cancel", cancleLeaveStatus)

export default router