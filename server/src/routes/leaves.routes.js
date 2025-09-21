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
} from "../handlers/controllers/leaveControllers/leaveController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const leaveRouter = Router();

leaveRouter.get("/", requireAuth, requireRole('ADMIN'), getAllLeaves);
leaveRouter.get("/:id", requireAuth, getSingleLeaveDetails);

leaveRouter.get("/teacher/:id", requireAuth, getLeavesByTeacherId);
leaveRouter.get("/teacher/:id/pending", requireAuth, getPendingLeavesByTeacherId);
leaveRouter.get("/teacher/:id/rejected", requireAuth, getRejectLeavesByTeacherId);

leaveRouter.patch("/:id/approve", requireAuth, requireRole('ADMIN'), approveLeaveStatus);
leaveRouter.patch("/:id/reject", requireAuth, requireRole('ADMIN'), rejectLeaveStatus);
leaveRouter.patch("/:id/cancel", requireAuth, requireRole('ADMIN'), cancelLeaveStatus);

export default leaveRouter;
