import { hashPassword } from "../../../services/utils/crypto";
import { consumeInviteToken } from "../../repositories/authRepositories/tokenRepository";
import { setTeacherPasswordHash } from "../../repositories/teacherRepositories/teacherRepository";

export async function activateUseCase({ token, user_id, password }) {
    if (!token || !user_id || !password) {
        return {
            ok: false,
            status: 400,
            message: "Required fields are missing."
        };
    }

    if (String(password).length < 10) {
        return {
            ok: false,
            status: 400,
            message: "Password must be at least 10 characters long."
        };
    }

    const token_hash = hashToken(token);
    const { data: storedToken, error: tokenError } = await consumeInviteToken(token_hash);
    if (tokenError || !storedToken) {
        return {
            ok: false,
            status: 400,
            message: "Invalid or expired invitation link."
        };
    }

    if (storedToken.user_id !== user_id) {
        return {
            ok: false,
            status: 400,
            message: "Token does not match the user."
        };
    }

    const password_hash = await hashPassword(password);
    const { data: teacher, error: updateError } = await setTeacherPasswordHash(user_id, password_hash);
    if (updateError || !teacher) {
        return {
            ok: false,
            status: 500,
            message: "Failed to set password. Please try again."
        };
    }

    return {
        ok: true,
        status: 200,
        message: "Account activated successfully."
    };
}