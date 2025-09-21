import { findRefreshToken, deleteRefreshToken, storeRefreshToken } from '../../repositories/authRepositories/tokenRepository.js';
import { hashToken, signAccessJwt, randomToken } from '../../../services/utils/crypto.js';
import { REFRESH_TOKEN_TTL_DAYS, ACCESS_TOKEN_TTL_MIN } from '../../../config/security.js';
import { getTeacherByUserId } from '../../repositories/teacherRepositories/teacherRepository.js';

export async function refreshUseCase(refreshPlain) {
    const token_hash = hashToken(refreshPlain);
    const { data: rt, error } = await findRefreshToken(token_hash);

    if (error || !rt) {
        return { error: 'Invalid refresh', status: 401 };
    }

    const deleted = await deleteRefreshToken(token_hash);
    if (deleted.error) {
        return { error: 'Something went wrong', status: 500 };
    }

    const { data: teacher } = await getTeacherByUserId(rt.user_id);
    if (!teacher) {
        return { error: 'User not found', status: 404 };
    }

    const payload = { uid: teacher.user_id, role: teacher.role, nic: teacher.teacher_nic };
    const newAccess = signAccessJwt(payload, ACCESS_TOKEN_TTL_MIN);

    const newRefreshPlain = randomToken(48);
    const newRefreshHash = hashToken(newRefreshPlain);
    const stored = await storeRefreshToken(teacher.user_id, newRefreshHash, REFRESH_TOKEN_TTL_DAYS);
    if (stored.error) {
        return { error: 'Something went wrong', status: 500 };
    }

    return {
        ok: true,
        status: 200,
        data: {
            accessToken: newAccess,
            refreshToken: newRefreshPlain
        }
    };
}
