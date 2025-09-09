import { ok, fail } from '../../../services/utils/response.js';
import { inviteUseCase } from '../../usecases/authUseCase/inviteUseCase.js';

export async function sendInviteController(req, res) {
    try {
        const { email, user_id } = req.body || {};
        console.log("Invite Controller Invoked with:", { email, user_id });

        if (!email || !user_id) return fail(res, 'Required fields are missing', 400);

        const { data, error, status } = await inviteUseCase({ email, user_id });

        if (error) return fail(res, error, status || 400);

        return ok(res, data, 'Invite sent');
    } catch (e) {
        return fail(res, 'Invite failed', 500, { detail: e?.message });
    }
}
