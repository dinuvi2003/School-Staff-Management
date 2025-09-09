import { db } from "../../../config/supabase.js";

export async function getTeacherByEmail(email) {
    const { data: teacher, error } = await db
        .from('teacher')
        .select('*')
        .eq('email', email);

    if (error) {
        return { error, data: null };
    }
    if (!data) {
        return {
            ok: false,
            status: 404,
            message: "No teacher found with the provided email."
        }
    }
    return { data: teacher, error: null };
}

export async function getTeacherByUserId(user_id) {
    const { data: teacher, error } = await db
        .from('teacher')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) {
        return { error, data: null };
    }
    if (!teacher) {
        return {
            ok: false,
            status: 404,
            message: "No teacher found with the provided user ID."
        }
    }
    return { data: teacher, error: null };
}


export async function createTeacherRow(payload) {
    const { data: teacher, error } = await db
        .from('teacher')
        .insert(payload)
        .select('*')
        .single();

    if (error) {
        return { error, data: null };
    }
    return { data: teacher, error: null };
}

export async function setTeacherPasswordHash(user_id, password_hash) {
    const { data: teacher, error } = await db
        .from('teacher')
        .update({ password: password_hash })
        .eq('user_id', user_id);

    if (error) {
        return { error, data: null };
    }
    return { data: teacher, error: null };
}