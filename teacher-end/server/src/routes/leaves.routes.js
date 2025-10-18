import { Router } from "express";
import {
    getAllLeaves,
    getSingleLeaveDetails,
    approveLeaveStatus,
    rejectLeaveStatus,
    cancelLeaveStatus,
    getLeavesByTeacherId,
    getPendingLeavesByTeacherId,
    getRejectLeavesByTeacherId,
    getApprovedLeavesByTeacherId,
} from "../handlers/controllers/leaveControllers/leaveController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireRole('ADMIN'), getAllLeaves);
router.get("/:id", requireAuth, requireRole('ADMIN'), getSingleLeaveDetails);

router.get("/teacher/:id", requireAuth, getLeavesByTeacherId);
router.get("/teacher/:id/pending", requireAuth, getPendingLeavesByTeacherId);
router.get("/teacher/:id/rejected", requireAuth, getRejectLeavesByTeacherId);
// router.get("/teacher/:id/approved", requireAuth, getApprovedLeavesByTeacherId);

router.patch("/:id/approve", requireAuth, requireRole('ADMIN'), approveLeaveStatus);
router.patch("/:id/reject", requireAuth, requireRole('ADMIN'), rejectLeaveStatus);
router.patch("/:id/cancel", requireAuth, requireRole('ADMIN'), cancelLeaveStatus);

export default router;
