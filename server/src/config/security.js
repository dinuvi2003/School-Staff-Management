const isProd = process.env.NODE_ENV === 'production';

export const ACCESS_TOKEN_TTL_MIN = Number(process.env.ACCESS_TOKEN_TTL_MIN || 30);
export const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
export const JWT_SECRET = process.env.JWT_SECRET || '5fa8386249ffe6e224f38f8492ca147e53b016396add093296e1f569344f6471';

export const cookieBase = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax'
};


