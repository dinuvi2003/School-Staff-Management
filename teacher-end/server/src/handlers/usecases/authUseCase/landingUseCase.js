import { verifyAccessJwt } from "../../../services/utils/crypto"

const adminUrl = "http://localhost:3001/admin-dashboard";
const teacherUrl = "http://localhost:3000/teacher-dashboard";
const loginUrl = "http://localhost:3000/login";

export async function landingUseCase(access_token) {
    if (!access_token) {
        return loginUrl;
    }

    const { payload, error } = verifyAccessJwt(access_token);
    if (error || !payload) {
        return {
            ok: false,
            url: loginUrl,
            status: 401,
            message: "Invalid or expired token."
        };
    }

    const role = payload.role;

    if (!role) {
        return {
            ok: false,
            url: loginUrl,
            status: 400,
            message: "Something went wrong. Please try again."
        };
    }

    if (role === 'ADMIN') {

        return {
            ok: true,
            url: adminUrl,
            status: 200,
            message: "Redirecting to admin dashboard."
        };

    } else if (role === 'TEACHER') {

        return {
            ok: true,
            url: teacherUrl,
            status: 200,
            message: "Redirecting to teacher dashboard."
        };

    } else {
        return {
            ok: false,
            url: loginUrl,
            status: 400,
            message: "Something went wrong. Please try again."
        }
    }


}