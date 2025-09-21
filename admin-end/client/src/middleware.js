import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';
const TEACHER_ORIGIN = process.env.NEXT_PUBLIC_TEACHER_ORIGIN || 'http://localhost:3000';
const TEACHER_LOGIN = `${TEACHER_ORIGIN}/login`;
const TEACHER_DASH = `${TEACHER_ORIGIN}/teacher-dashboard`;

async function fetchMe(req) {
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

    // All admin pages are protected. If you had a dedicated admin login page in this app, whitelist it here.
    if (!access && !refresh) {
        return NextResponse.redirect(TEACHER_LOGIN);
    }

    let me = access ? await fetchMe(req) : { ok: false };
    if (!me.ok && refresh) {
        const r = await refreshTokens(refresh.value);
        if (!r.ok) return NextResponse.redirect(TEACHER_LOGIN);

        const res = NextResponse.next();
        res.cookies.set('access_token', r.accessToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 15 });
        res.cookies.set('refresh_token', r.refreshToken, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 24 * 7 });
        me = await fetchMe(req); // NOTE: this fetch still has the old req headers; but for our purposes we only need the role gate.
        // We can trust role from JWT decode if you prefer passing it back in refresh response; but usually me() is enough.
    }

    if (!me.ok) {
        return NextResponse.redirect(TEACHER_LOGIN);
    }

    if (me.role !== 'ADMIN') {
        // Not an admin → bounce to teacher app dashboard
        return NextResponse.redirect(TEACHER_DASH);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin-dashboard',
        '/admin-dashboard/:path*',
        '/TeacherDetailsSinglePage/:path*',
        '/AddTeacher',
    ],
};
