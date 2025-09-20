import { clearAuthCookies, COOKIE } from "../../../services/utils/cookies.js";
import { fail, ok } from "../../../services/utils/response.js";
import { logoutUseCase } from "../../usecases/authUseCase/logoutUseCase.js";

export default async function logoutController(req, res) {
    try {
        const access = req.cookies[COOKIE.refresh];
        await logoutUseCase(access);
        clearAuthCookies(res);
        return ok(res, {}, 'Logged out');
    } catch (e) {
        return fail(res, 'Logout failed', 500, { detail: e?.message });
    }
}