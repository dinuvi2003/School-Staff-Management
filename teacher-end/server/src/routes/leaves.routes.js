import { Router } from 'express'
const router = Router()
import { getAllLeaves, getSingleLeaveDetails, approveLeaveStatus, rejectLeaveStatus, cancleLeaveStatus } from "../controller/leave.controller.js"

router.get("/", leaveContraoller.getAllLeaves)
router.get("/:id", leaveContraoller.getSingleLeaveDetails)

router.get("/teacher/:id", leaveContraoller.getLeavesByTeacherId)
router.get("/teacher/:id/pending", leaveContraoller.getPendingLeavesByTeacherId)
router.get("/teacher/:id/rejected", leaveContraoller.getRejectLeavesByTeacherId)

router.patch("/:id/approve", leaveContraoller.approveLeaveStatus)
router.patch("/:id/reject", leaveContraoller.rejectLeaveStatus)
router.patch("/:id/cancel", leaveContraoller.cancleLeaveStatus)

export default router