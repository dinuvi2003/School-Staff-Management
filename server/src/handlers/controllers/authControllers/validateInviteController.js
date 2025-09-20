import { hashToken } from '../../../services/utils/crypto.js';
import { validateInviteToken } from '../../repositories/authRepositories/tokenRepository.js';
import { ok, fail } from '../../../services/utils/response.js';

export async function validateInviteController(req, res) {
    try {
        const { token, user_id } = req.query || {};
        if (!token || !user_id) return fail(res, 'Missing token or user_id', 400);
        const token_hash = hashToken(token);
        const { data, error } = await validateInviteToken(token_hash);
        console.log("Validate Invite Token:", { token, user_id, token_hash, data, error });
        if (error || !data) return fail(res, 'Invalid/expired invite', 400);
        if (String(data.user_id) !== String(user_id)) {
            return fail(res, 'Token does not match user', 400);
        }
        return ok(res, { valid: true });
    } catch (e) {
        return fail(res, 'Validate failed', 500, { detail: e?.message });
    }
}
