import { fail, okay } from '../../../services/utils/response.js';
import { activateUseCase } from '../../usecases/authUseCase/activateUseCase.js';

export async function activateController(req, res) {
    try {
        const { token, user_id, password } = req.body || {};

        if (!token || !user_id || !password) return fail(res, 'Required fields are missing', 400);

        console.log("Activate Controller Invoked with:", token, user_id, password);

        const { status, ok, message } = await activateUseCase({ token, user_id, password });

        if (!ok) return fail(res, message || 'Activation failed', status || 400);

        console.log("Password set")
        return okay(res, message, 'Account activated', status || 200);
    } catch (e) {
        console.log("Password Notset")
        return fail(res, 'Activation failed', 500, { detail: e?.message });
    }
}
