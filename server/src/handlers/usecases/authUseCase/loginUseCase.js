import { ACCESS_TOKEN_TTL_MIN, REFRESH_TOKEN_TTL_DAYS } from "../../../config/security.js";
import { hashToken, randomToken, signAccessJwt, verifyPassword } from "../../../services/utils/crypto.js";
import { storeRefreshToken } from "../../repositories/authRepositories/tokenRepository.js";
import { getTeacherByEmail } from "../../repositories/teacherRepositories/teacherRepository.js";


export async function loginUseCase(email, password) {

    console.log("Login Use Case Invoked with:", email);

    if (!email || !password) {
        return {
            ok: false,
            status: 400,
            message: "Email and password are required."
        };
    }

    const { data: teacher, error } = await getTeacherByEmail(email);

    console.log("SignIn Response:", { teacher, error });

    if (error || !teacher) {
        return {
            ok: false,
            status: 401,
            message: error?.message || "Invalid email or password."
        };
    }

    const ok = await verifyPassword(password, teacher.password);

    console.log("pw ok", ok);

    if (!ok) {
        return {
            ok: false,
            status: 401,
            message: "Invalid email or password."
        };
    }
    console.log("dp", teacher.teacher_profile_image);
    console.log("fulll nameee", teacher.teacher_full_name);

    const userPayload = { uid: teacher.user_id, role: teacher.role, nic: teacher.teacher_nic, email: teacher.email, name: teacher.teacher_full_name, dp: teacher.teacher_profile_image };
    const accessToken = signAccessJwt(userPayload, ACCESS_TOKEN_TTL_MIN);

    console.log("Access token", accessToken);

    const refreshPlain = randomToken(48);
    const refreshHash = hashToken(refreshPlain);

    const { data: insertRefreshToken, error: insertRefreshTokenError } = await storeRefreshToken(teacher.user_id, refreshHash, REFRESH_TOKEN_TTL_DAYS);

    console.log("insertRefreshToken", insertRefreshToken);
    console.log("insert RefreshToken Error", insertRefreshTokenError);

    if (!insertRefreshToken || insertRefreshTokenError) {
        return {
            ok: false,
            status: 500,
            message: "Something went wrong. Please try again."
        };
    }

    return {
        ok: true,
        status: 200,
        message: "Login successful.",
        data: {
            role: teacher.role,
            accessToken,
            refreshToken: refreshPlain
        }
    };

}