import { setAccessCookie, setRefreshCookie } from "../../../services/utils/cookies.js";
import { fail, okay } from "../../../services/utils/response.js";
import { loginUseCase } from "../../usecases/authUseCase/loginUseCase.js";

export default async function loginController(req, res) {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return fail(res, 'Email & password required', 400);

        console.log("email pw", email, password);

        const { data, ok, status, message } = await loginUseCase(email, password);

        console.log("dataaaa", data)
        if (!data || !ok) {
            return fail(res, message, status || 400);
        }

        const accessToken = data?.accessToken;
        const refreshToken = data?.refreshToken;

        setAccessCookie(res, accessToken, 15); // 15 min
        setRefreshCookie(res, refreshToken, 7); // 7 days

        console.log("Login success.")

        return okay(res,
            { logged_in: true, role: data.role },
            message,
            status
        );

    } catch (e) {
        console.log("Login Fails.")
        return fail(res, 'Login failed', 500, { detail: e?.message });
    }
}