import { COOKIE, setAccessCookie } from "../../../services/utils/cookies.js";
import { fail, okay } from "../../../services/utils/response.js";
import { refreshUseCase } from "../../usecases/authUseCase/refreshUseCase.js";

export default async function refreshController(req, res) {
    try {
        const refresh = req.cookies[COOKIE.refresh];
        if (!refresh) return fail(res, 'No refresh token', 401);

        const { data, ok, error, status } = await refreshUseCase(refresh);
        if (!data || !ok || error) return fail(res, error, status || 401);

        const { accessToken, refreshToken } = data;

        setAccessCookie(res, accessToken, 15 * 60); // 15 min
        setRefreshCookie(res, refreshToken, 7); // 7 days
        return okay(res, { refreshed: true });
    } catch (e) {
        return fail(res, 'Refresh failed', 500, { detail: e?.message });
    }
}
