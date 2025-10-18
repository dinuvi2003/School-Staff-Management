import {
    repoGetAllLeaves,
    repoGetLeaveById,
    repoGetLeavesByTeacher,
    repoGetLeavesByTeacherAndStatus,
    repoUpdateLeaveStatus,
} from "../../repositories/leaveRepositories/leaveRepository.js";

const STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
};

// list
export async function ucListLeaves() {
    const { data, error } = await repoGetAllLeaves();
    if (error) return { error: "Failed to fetch leaves", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No leaves found", status: 404 };
    return { data };
}

export async function ucGetLeave(leave_id) {
    const { data, error } = await repoGetLeaveById(leave_id);
    if (error) return { error: "Leave not found", status: 404, detail: error.message };
    return { data };
}

// status transitions (only from PENDING)
async function transitionLeave(leave_id, targetStatus) {
    const { data: current, error: findErr } = await repoGetLeaveById(leave_id);
    if (findErr || !current) return { error: "Leave not found", status: 404 };

    if (current.leave_status !== STATUS.PENDING) {
        return { error: `Only ${STATUS.PENDING} leaves can be updated`, status: 400 };
    }

    const { data, error } = await repoUpdateLeaveStatus(leave_id, targetStatus);
    if (error) return { error: "Failed to update leave", status: 400, detail: error.message };
    return { data };
}

export async function ucApproveLeave(leave_id) {
    return await transitionLeave(leave_id, STATUS.APPROVED);
}

export async function ucRejectLeave(leave_id) {
    return await transitionLeave(leave_id, STATUS.REJECTED);
}

export async function ucCancelLeave(leave_id) {
    return await transitionLeave(leave_id, STATUS.CANCELLED);
}

// teacher scoped
export async function ucListLeavesByTeacher(teacher_nic) {
    const { data, error } = await repoGetLeavesByTeacher(teacher_nic);
    if (error) return { error: "Failed to fetch leaves", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No leaves found", status: 404 };
    return { data };
}

export async function ucListPendingByTeacher(teacher_nic) {
    const { data, error } = await repoGetLeavesByTeacherAndStatus(teacher_nic, STATUS.PENDING);
    if (error) return { error: "Failed to fetch pending leaves", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No pending leaves", status: 404 };
    return { data };
}

export async function ucListRejectedByTeacher(teacher_nic) {
    const { data, error } = await repoGetLeavesByTeacherAndStatus(teacher_nic, STATUS.REJECTED);
    if (error) return { error: "Failed to fetch rejected leaves", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No rejected leaves", status: 404 };
    return { data };
}

export async function ucListApprovedByTeacher(teacher_nic) {
    const { data, error } = await repoGetLeavesByTeacherAndStatus(teacher_nic, STATUS.APPROVED);
    if (error) return { error: "Failed to fetch approved leaves", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No approved leaves", status: 404 };
    return { data };
}