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
} from "../handlers/controllers/leaveControllers/leaveController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const leaveRouter = Router();

leaveRouter.get("/", getAllLeaves);
leaveRouter.get("/:id", getSingleLeaveDetails);

leaveRouter.get("/teacher/:id", getLeavesByTeacherId);
leaveRouter.get("/teacher/:id/pending", getPendingLeavesByTeacherId);
leaveRouter.get("/teacher/:id/rejected", getRejectLeavesByTeacherId);

leaveRouter.post("/new-leave", createNewLeave)

leaveRouter.patch("/:id/approve", approveLeaveStatus);
leaveRouter.patch("/:id/reject", rejectLeaveStatus);
leaveRouter.patch("/:id/cancel", cancelLeaveStatus);

export default leaveRouter;
