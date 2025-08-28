const express = require('express')
const router = express.Router()
const leaveContraoller = require("../controller/leave.controller")

router.get("/", leaveContraoller.getAllLeaves)
router.get("/:id", leaveContraoller.getSingleLeaveDetails)
router.patch("/:id/approve", leaveContraoller.approveLeaveStatus)
router.patch("/:id/reject", leaveContraoller.rejectLeaveStatus)
router.patch("/:id/cancel", leaveContraoller.cancleLeaveStatus)

module.exports = router