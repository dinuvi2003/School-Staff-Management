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
    createNewLeave,
    getLeaveHistoryByTeacher,
    getSingleLeaveDetailsWithTeacher,
} from "../handlers/controllers/leaveControllers/leaveController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const leaveRouter = Router();

leaveRouter.get("/", requireAuth, requireRole('ADMIN'), getAllLeaves);
leaveRouter.get("/:id", requireAuth, getSingleLeaveDetails);
leaveRouter.get("/with-teacher/:id", requireAuth, requireRole('ADMIN'), getSingleLeaveDetailsWithTeacher);

leaveRouter.get("/teacher/:id", getLeavesByTeacherId);
leaveRouter.get("/teacher/:id/pending", getPendingLeavesByTeacherId);
leaveRouter.get("/teacher/:id/rejected", getRejectLeavesByTeacherId);

leaveRouter.post("/new-leave", createNewLeave)

leaveRouter.patch("/:id/approve", approveLeaveStatus);
leaveRouter.patch("/:id/reject", rejectLeaveStatus);
leaveRouter.patch("/:id/cancel", cancelLeaveStatus);
leaveRouter.get("/leave-history/:id", requireAuth, requireRole('ADMIN'), getLeaveHistoryByTeacher);

export default leaveRouter;

