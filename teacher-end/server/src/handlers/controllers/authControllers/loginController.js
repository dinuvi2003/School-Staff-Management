import { setAuthCookies } from "../../../services/utils/cookies.js";
import { fail, ok } from "../../../services/utils/response.js";
import { loginUseCase } from "../../usecases/authUseCase/loginUseCase.js";

export default async function loginController(req, res) {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return fail(res, 'Email & password required', 400);

        const { data, error, status } = await loginUseCase(email, password);
        if (error) return fail(res, error, status || 400);


        const { session, role } = { session: data.session, role: data.role };
        const access_token = session.access_token;
        const refresh_token = session.refresh_token;


        setAuthCookies(res, {
            access_token,
            refresh_token,
            access_expires_sec: 15 * 60,     // 15 min
            refresh_expires_sec: 7 * 24 * 60 * 60 // 7 days
        });

        return ok(res, { role }, 'Login success');
    } catch (e) {
        return fail(res, 'Login failed', 500, { detail: e?.message });
    }
}