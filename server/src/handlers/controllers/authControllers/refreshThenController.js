import { refreshUseCase } from '../../usecases/authUseCase/refreshUseCase.js';
import { COOKIE, setAccessCookie, setRefreshCookie } from '../../../services/utils/cookies.js';
import { okay } from '../../../services/utils/response.js';

const WEB_TEACHER = process.env.WEB_TEACHER || 'http://localhost:3000';

export async function refreshThenController(req, res) {
    try {
        const nextUrl = req.query.next || `${WEB_TEACHER}/login`;
        const refresh = req.cookies[COOKIE.refresh];

        if (!refresh) return res.redirect(`${WEB_TEACHER}/login`);

        const { data, error, status } = await refreshUseCase(refresh);
        if (error || !data) return res.redirect(`${WEB_TEACHER}/login`);

        const { accessToken, refreshToken } = data;

        // Set new cookies in the BROWSER
        setAccessCookie(res, accessToken, 15 * 60); // 15 min
        setRefreshCookie(res, refreshToken, 7);     // 7 days

        // Go back to the original page
        return okay(res, { refreshed: true, accessToken: accessToken, refreshToken: refreshToken });
    } catch (e) {
        return res.redirect(`${WEB_TEACHER}/login?reason=exception`);
    }
}
