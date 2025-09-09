import { ok, fail } from '../../../services/utils/response.js';
import { activateUseCase } from '../../usecases/authUseCase/activateUseCase.js';

export async function activateController(req, res) {
    try {
        const { token, user_id, password } = req.body || {};
        const { data, error, status } = await activateUseCase({ token, user_id, password });
        if (error) return fail(res, error, status || 400);
        return ok(res, data, 'Password set');
    } catch (e) {
        return fail(res, 'Activation failed', 500, { detail: e?.message });
    }
}
