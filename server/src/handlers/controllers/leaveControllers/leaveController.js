import { ok, fail } from "../../../services/utils/response.js";
import {
    ucListLeaves,
    ucGetLeave,
    ucApproveLeave,
    ucRejectLeave,
    ucCancelLeave,
    ucListLeavesByTeacher,
    ucListPendingByTeacher,
    ucListRejectedByTeacher,
    leaveHistoryByTeacher,
    ucGetLeaveWithTeacher,
} from "../../usecases/leaveUseCase/leaveUseCase.js";

// GET /api/leave
export async function getAllLeaves(req, res) {
    const { data, error, status, detail } = await ucListLeaves();
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { leaves: data }, "OK");
}

// GET /api/leave/:id
export async function getSingleLeaveDetails(req, res) {
    const leaveId = req.params.id;
    const { data, error, status, detail } = await ucGetLeave(leaveId);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { leave: data }, "OK");
}

// GET /api/leave/with-teacher/:id
export async function getSingleLeaveDetailsWithTeacher(req, res) {
    const leaveId = req.params.id;
    const { data, error, status, detail } = await ucGetLeaveWithTeacher(leaveId);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { leave: data }, "OK");
}

// PATCH /api/leave/:id/approve
export async function approveLeaveStatus(req, res) {
    const leave_id = req.params.id;
    console.log("Leave id for approve", leave_id);
    const { data, error, status, detail } = await ucApproveLeave(leave_id);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, data, "Leave approved", 201);
}

// PATCH /api/leave/:id/reject
export async function rejectLeaveStatus(req, res) {
    const leave_id = req.params.id;
    const { data, error, status, detail } = await ucRejectLeave(leave_id);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, data, "Leave rejected", 201);
}

// PATCH /api/leave/:id/cancel
export async function cancelLeaveStatus(req, res) {
    const leave_id = req.params.id;
    const { data, error, status, detail } = await ucCancelLeave(leave_id);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, data, "Leave canceled", 201);
}

// GET /api/leave/teacher/:id
export async function getLeavesByTeacherId(req, res) {
    const teacher_nic = req.params.id;
    const { data, error, status, detail } = await ucListLeavesByTeacher(teacher_nic);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { leaves: data }, "OK");
}

// GET /api/leave/teacher/:id/pending
export async function getPendingLeavesByTeacherId(req, res) {
    const teacher_nic = req.params.id;
    console.log("Teacher ID pending", teacher_nic);
    const { data, error, status, detail } = await ucListPendingByTeacher(teacher_nic);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { leaves: data }, "OK");
}

// GET /api/leave/teacher/:id/rejected
export async function getRejectLeavesByTeacherId(req, res) {
    const teacher_nic = req.params.id;
    console.log("Teacher ID for rejected", teacher_nic);
    const { data, error, status, detail } = await ucListRejectedByTeacher(teacher_nic);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { leaves: data }, "OK");
}

export async function getLeaveHistoryByTeacher(req, res) {
    const teacher_user_id = req.params.id;
    console.log("teacher id for history", teacher_user_id)
    const { data, error } = await leaveHistoryByTeacher(teacher_user_id);
    if (error || !data) return fail(res, "No leave history found", 404);
    return ok(res, data, "OK");
}