import { COOKIE, setAccessCookie } from "../../../services/utils/cookies.js";
import { fail, ok } from "../../../services/utils/response.js";
import { refreshUseCase } from "../../usecases/authUseCase/refreshUseCase.js";

export default async function refreshController(req, res) {
    try {
        const refresh = req.cookies[COOKIE.refresh];
        if (!refresh) return fail(res, 'No refresh token', 401);

        const { data, error, status } = await refreshUseCase(refresh);
        if (error) return fail(res, error, status || 401);

        const { access_token, refresh_token, expires_in } = data.session;

        setAccessCookie(res, access_token, 15 * 60); // 15 min
        setRefreshCookie(res, refresh_token, 7); // 7 days
        return ok(res, { refreshed: true });
    } catch (e) {
        return fail(res, 'Refresh failed', 500, { detail: e?.message });
    }
}
