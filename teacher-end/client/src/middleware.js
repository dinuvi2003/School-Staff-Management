import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const TEACHER_DASH = '/teacher-dashboard';
const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_ORIGIN || 'http://localhost:3001';
const ADMIN_DASH_URL = `${ADMIN_ORIGIN}/admin-dashboard`;

async function fetchMe(req, withAccess) {
    // Try /api/me with current cookies; if withAccess === false we won’t bother.
    try {
        const me = await fetch(`${API_BASE}/api/me`, {
            method: 'GET',
            headers: { cookie: req.headers.get('cookie') || '' },
        });
        if (!me.ok) return { ok: false };
        const json = await me.json();
        return json?.ok ? { ok: true, role: json.data?.role } : { ok: false };
    } catch {
        return { ok: false };
    }
}

async function refreshTokens(refreshCookieValue) {
    try {
        const resp = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: { cookie: `refresh_token=${refreshCookieValue}` },
        });
        if (!resp.ok) return { ok: false };

        const json = await resp.json().catch(() => null);
        const accessToken = json?.data?.accessToken;
        const refreshToken = json?.data?.refreshToken;
        if (!accessToken || !refreshToken) return { ok: false };

        return { ok: true, accessToken, refreshToken };
    } catch {
        return { ok: false };
    }
}

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const access = req.cookies.get('access_token');
    const refresh = req.cookies.get('refresh_token');
    const isProd = process.env.NODE_ENV === 'production';

    // 1) root “/” → push to /login (or dashboards if already authed)
    if (pathname === '/' || pathname === '') {
        // Check session quickly
        if (!access && !refresh) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Try me; if invalid, try refresh then me again
        let me = access ? await fetchMe(req, true) : { ok: false };
        if (!me.ok && refresh) {
            const r = await refreshTokens(refresh.value);
            if (r.ok) {
                const res = NextResponse.redirect(new URL(TEACHER_DASH, req.url));
                res.cookies.set('access_token', r.accessToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 });
                res.cookies.set('refresh_token', r.refreshToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 });
                return res;
            }
            // Couldn’t refresh → login
            return NextResponse.redirect(new URL('/login', req.url));
        }

        if (me.ok) {
            // Redirect to correct dashboard. Admins can use teacher app, so send them to teacher dash here.
            return NextResponse.redirect(new URL(TEACHER_DASH, req.url));
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 2) public pages
    const isPublic = pathname.startsWith('/login') || pathname.startsWith('/activate');
    if (isPublic) {
        // If not authenticated at all → allow
        if (!access && !refresh) return NextResponse.next();

        // Try me; if invalid → try refresh; if still invalid → allow (on login/activate)
        let me = access ? await fetchMe(req, true) : { ok: false };
        if (!me.ok && refresh) {
            const r = await refreshTokens(refresh.value);
            if (r.ok) {
                // now authenticated → send to correct place
                const res = NextResponse.redirect(new URL(TEACHER_DASH, req.url));
                res.cookies.set('access_token', r.accessToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 });
                res.cookies.set('refresh_token', r.refreshToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 });
                return res;
            }
            // refresh failed → just show login/activate
            return NextResponse.next();
        }

        if (me.ok) {
            // Already logged in → go to dashboard
            return NextResponse.redirect(new URL(TEACHER_DASH, req.url));
        }
        return NextResponse.next();
    }

    // 3) protected teacher pages
    if (!access && !refresh) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Try me; if invalid, try refresh; if still invalid, go to login
    let me = access ? await fetchMe(req, true) : { ok: false };
    if (!me.ok && refresh) {
        const r = await refreshTokens(refresh.value);
        if (!r.ok) return NextResponse.redirect(new URL('/login', req.url));

        // set new cookies, then allow through
        const res = NextResponse.next();
        res.cookies.set('access_token', r.accessToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 });
        res.cookies.set('refresh_token', r.refreshToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 });
        return res;
    }

    // me.ok = true → role rules for teacher app:
    // - TEACHER: allowed
    // - ADMIN: allowed (you wanted admins to use teacher app too)
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',                // home redirect logic
        '/login',
        '/activate',
        '/teacher-dashboard',
    ],
};
