import { cookieBase } from '../../config/security.js';

export const COOKIE = {
    access: 'access_token',
    refresh: 'refresh_token'
};

export function setAccessCookie(res, token, ttlMin) {
    res.cookie(COOKIE.access, token, { ...cookieBase, maxAge: ttlMin * 60 * 1000 });
}
export function setRefreshCookie(res, token, ttlDays) {
    res.cookie(COOKIE.refresh, token, { ...cookieBase, maxAge: ttlDays * 24 * 60 * 60 * 1000 });
}
export function clearAuthCookies(res) {
    res.clearCookie(COOKIE.access, cookieBase);
    res.clearCookie(COOKIE.refresh, cookieBase);
}
