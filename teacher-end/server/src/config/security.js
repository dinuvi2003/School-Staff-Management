const isProd = process.env.NODE_ENV === 'production';

export const ACCESS_TOKEN_TTL_MIN = Number(process.env.ACCESS_TOKEN_TTL_MIN || 15);
export const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
export const JWT_SECRET = process.env.JWT_SECRET;

export const cookieBase = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax'
};
