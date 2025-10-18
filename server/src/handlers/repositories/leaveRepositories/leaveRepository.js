import { db } from "../../../config/supabase.js";

// basic reads
export async function repoGetAllLeaves() {
    return await db.from("leave_with_teacher").select("*");
}

export async function repoGetLeaveById(leave_id) {
    return await db.from("leave").select("*").eq("leave_id", leave_id).single();
}

export async function repoGetLeaveByIdWithTeacher(leave_id) {
    return await db.from("leave_with_teacher").select("*").eq("leave_id", leave_id).single();
}

export async function repoGetLeavesByTeacher(teacher_id) {
    return await db.from("leave").select("*").eq("teacher_id", teacher_id);
}

export async function repoGetLeavesByTeacherAndStatus(teacher_id, status) {
    return await db
        .from("leave")
        .select("*")
        .eq("teacher_id", teacher_id)
        .eq("teacher_id", teacher_nic)
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


// create new leave
export async function repoCreateNewLeave(teacher_id, leave_type, leave_date, arrival_date, days_count) {
    return await db
        .from("leave")
        .insert([
            {
                "teacher_id": teacher_id,
                "leave_type": leave_type,
                "leave_date": leave_date,
                "arrival_date": arrival_date,
                "leave_day_count": days_count
            }
        ])
        .select("*")
        .single();
}
export async function repoGetLeaveHistoryByTeacher(teacher_id) {
    return await db
        .from("teacher_leave_summary")
        .select("*")
        .eq("teacher_user_id", teacher_id)
        .single();
}
