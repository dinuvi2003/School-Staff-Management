import { db } from "../../../config/supabase.js";

// basic reads
export async function repoGetAllLeaves() {
    return await db.from("leave").select("*");
}

export async function repoGetLeaveById(leave_id) {
    return await db.from("leave").select("*").eq("leave_id", leave_id).single();
}

export async function repoGetLeavesByTeacher(teacher_nic) {
    return await db.from("leave").select("*").eq("teacher_nic", teacher_nic);
}

export async function repoGetLeavesByTeacherAndStatus(teacher_nic, status) {
    return await db
        .from("leave")
        .select("*")
        .eq("teacher_nic", teacher_nic)
        .eq("leave_status", status);
}

// status mutation
export async function repoUpdateLeaveStatus(leave_id, newStatus) {
    return await db
        .from("leave")
        .update({ leave_status: newStatus, leave_updated_date: new Date().toISOString() })
        .eq("leave_id", leave_id)
        .select("*")
        .single();
}
