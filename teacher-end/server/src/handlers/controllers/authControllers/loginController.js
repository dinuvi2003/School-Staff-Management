import { setAccessCookie, setRefreshCookie } from "../../../services/utils/cookies.js";
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


        setAccessCookie(res, access_token, 15); // 15 min
        setRefreshCookie(res, refresh_token, 7); // 7 days

        return ok(res,
            { logged_in: true, role: data.role },
            'Login successful',
        );

    } catch (e) {
        return fail(res, 'Login failed', 500, { detail: e?.message });
    }
}