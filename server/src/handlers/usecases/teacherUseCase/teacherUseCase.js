import {
    repoGetAllTeachers,
    repoGetTeacherByNic,
    repoFindByNic,
    repoInsertTeacher,
    repoDeleteTeacherByUserIdOrNic,
} from "../../repositories/teacherRepositories/teacherRepository.js";

// list
export async function ucListTeachers() {
    const { data, error } = await repoGetAllTeachers();
    if (error) return { error: "Failed to fetch teachers", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No teachers found", status: 404 };
    return { data };
}

// single
export async function ucGetTeacher(nic) {
    const { data, error } = await repoGetTeacherByNic(nic);
    if (error) return { error: "Failed to fetch teacher", status: 400, detail: error.message };
    if (!data || data.length === 0) return { error: "No teacher found with this NIC", status: 404 };
    return { data };
}

// add new
export async function ucAddTeacher(payload) {

    console.log("payload", payload)
    // minimal validation
    const errors = {};
    if (!payload.fullName?.trim()) errors.fullName = "Full name is required";
    if (!payload.nic?.trim()) errors.nic = "NIC is required";
    if (!payload.phone || !/^(0\d{9}|(\+94)\d{9})$/.test(payload.phone))
        errors.phone = "Invalid Sri Lankan phone";
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
        errors.email = "Invalid email";
    if (!payload.address?.trim()) errors.address = "Address is required";
    if (!payload.gender) errors.gender = "Gender is required";
    if (!payload.service) errors.service = "Service is required";
    if (!payload.grader) errors.grader = "Grader is required";
    if (!payload.joinDate) errors.joinDate = "Join date is required";

    if (Object.keys(errors).length > 0) {
        return { error: "Validation failed", status: 400, detail: errors };
    }

    // check duplicates
    const { data: existing, error: findErr } = await repoFindByNic(payload.nic);
    if (findErr) return { error: "Lookup failed", status: 500, detail: findErr.message };
    if (existing && existing.length > 0) return { error: "NIC already exists", status: 409 };



    const row = {
        teacher_full_name: payload.fullName,
        teacher_nic: payload.nic,
        teacher_contact_number: payload.phone,
        email: (payload.email || "").toLowerCase(),
        teacher_address: payload.address,
        teacher_bd: payload.dob || null,
        teacher_gender: payload.gender,
        service_type: payload.service,
        teacher_grade: payload.grader,
        teacher_first_appointment_date: payload.joinDate,
        teacher_profile_image: payload.imageUrl,
        password: payload.password,
        created_date: new Date().toISOString(),
    };

    const { data, error } = await repoInsertTeacher(row);
    if (error) {
        if (error.code === "23505") return { error: "NIC already exists", status: 409 };
        return { error: "Insert failed", status: 500, detail: error.message };
    }

    return { data };
}

export async function ucDeleteTeacher(id) {
  if (!id) return { error: "Missing teacher id (user_id or teacher_nic)", status: 400 };

  const { data, error } = await repoDeleteTeacherByUserIdOrNic(id);

  if (error) return { error: "Delete failed", status: 500, detail: error.message };
  if (!data || data.length === 0) return { error: "Teacher not found", status: 404 };

  return { data };
}