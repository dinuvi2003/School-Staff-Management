const express = require('express')
const router = express.Router()
const leaveContraoller = require("../controller/leave.controller")

router.get("/", leaveContraoller.getAllLeaves)
router.get("/:id", leaveContraoller.getSingleLeaveDetails)

router.get("/teacher/:id", leaveContraoller.getLeavesByTeacherId)
router.get("/teacher/:id/pending", leaveContraoller.getPendingLeavesByTeacherId)

router.patch("/:id/approve", leaveContraoller.approveLeaveStatus)
router.patch("/:id/reject", leaveContraoller.rejectLeaveStatus)
router.patch("/:id/cancel", leaveContraoller.cancleLeaveStatus)

module.exports = router