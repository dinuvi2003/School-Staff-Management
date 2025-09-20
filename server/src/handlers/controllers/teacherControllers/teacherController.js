import { ok, fail } from "../../../services/utils/response.js";
import { inviteUseCase } from "../../usecases/authUseCase/inviteUseCase.js";
import { ucListTeachers, ucGetTeacher, ucAddTeacher } from "../../usecases/teacherUseCase/teacherUseCase.js";

// GET /api/teacher
export async function getAllTeachers(req, res) {
    const { data, error, status, detail } = await ucListTeachers();
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { teachers: data }, "OK");
}

// GET /api/teacher/:id
export async function getSingleTeacherDetails(req, res) {
    const teacher_nic = req.params.id;
    const { data, error, status, detail } = await ucGetTeacher(teacher_nic);
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});
    return ok(res, { teacher: data }, "OK");
}

// POST /api/teacher/add-new
export async function addNewTeacher(req, res) {
    const { data, error, status, detail } = await ucAddTeacher(req.body || {});
    if (error) return fail(res, error, status || 400, detail ? { detail } : {});

    const tEmail = data.email;
    const tUid = data.user_id;

    const { data: emailData, error: emailError, status: emailStatus } = await inviteUseCase({ email: tEmail, user_id: tUid });

    if (emailError) return fail(res, emailError, emailStatus || 400);
    return ok(res, { teacher: data }, "Teacher created successfully", 201);
}
