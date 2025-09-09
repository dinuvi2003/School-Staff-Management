import { ACCESS_TOKEN_TTL_MIN, REFRESH_TOKEN_TTL_DAYS } from "../../../config/security";
import { hashToken, randomToken, signAccessJwt, verifyPassword } from "../../../services/utils/crypto";
import { storeRefreshToken } from "../../repositories/authRepositories/tokenRepository";
import { getTeacherByEmail } from "../../repositories/teacherRepositories/teacherRepository";


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
    if (!ok) {
        return {
            ok: false,
            status: 401,
            message: "Invalid email or password."
        };
    }

    const userPayload = { uid: teacher.user_id, role: teacher.role, nic: teacher.teacher_nic, email: teacher.email };
    const accessToken = signAccessJwt(userPayload, ACCESS_TOKEN_TTL_MIN);

    const refreshPlain = randomToken(48);
    const refreshHash = hashToken(refreshPlain);

    const storeRefreshToken = await storeRefreshToken(teacher.user_id, refreshHash, REFRESH_TOKEN_TTL_DAYS);
    if (storeRefreshToken.error) {
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