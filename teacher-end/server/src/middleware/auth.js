// src/middleware/auth.js
import { COOKIE } from '../services/utils/cookies.js';
import { verifyAccessJwt } from '../services/utils/crypto.js';

export function requireAuth(req, res, next) {
    const token = req.cookies[COOKIE.access];
    if (!token) return res.status(401).json({ ok: false, errors: { message: 'Unauthorized' } });

    const { payload, error } = verifyAccessJwt(token);
    if (error || !payload) return res.status(401).json({ ok: false, errors: { message: 'Invalid/expired token' } });

    req.user = { uid: payload.uid, role: payload.role, nic: payload.nic };
    next();
}

export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ ok: false, errors: { message: 'Unauthorized' } });
        if (req.user.role !== role) return res.status(403).json({ ok: false, errors: { message: 'Forbidden' } });
        next();
    };
}
