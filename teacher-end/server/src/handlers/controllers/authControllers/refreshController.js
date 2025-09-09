import { COOKIE_NAMES, setAuthCookies } from "../../../services/utils/cookies.js";
import { fail, ok } from "../../../services/utils/response.js";
import { refreshUseCase } from "../../usecases/authUseCase/refreshUseCase.js";

export default async function refreshController(req, res) {
    try {
        const refresh = req.cookies[COOKIE_NAMES.refresh];
        if (!refresh) return fail(res, 'No refresh token', 401);

        const { data, error, status } = await refreshUseCase(refresh);
        if (error) return fail(res, error, status || 401);

        const { access_token, refresh_token, expires_in } = data.session;
        setAuthCookies(res, {
            access_token,
            refresh_token,
            access_expires_sec: Math.min(expires_in || 3600, 15 * 60),
            refresh_expires_sec: 7 * 24 * 60 * 60
        });
        return ok(res, { refreshed: true });
    } catch (e) {
        return fail(res, 'Refresh failed', 500, { detail: e?.message });
    }
}
