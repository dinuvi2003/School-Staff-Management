import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ACCESS_TOKEN_TTL_MIN } from '../../config/security.js';

const SALT_ROUNDS = 12;

export async function hashPassword(plain) { return bcrypt.hash(plain, SALT_ROUNDS); }
export async function verifyPassword(plain, hash) { return bcrypt.compare(plain, hash); }

export function randomToken(bytes = 48) { return crypto.randomBytes(bytes).toString('hex'); }
export function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }

export function signAccessJwt(payload, ttlMin = ACCESS_TOKEN_TTL_MIN) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: `${ttlMin}m` });
}
export function verifyAccessJwt(token) {
    try { return { payload: jwt.verify(token, JWT_SECRET) }; }
    catch (e) { return { error: e }; }
}
                                          