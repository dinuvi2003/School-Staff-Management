import { makeUserClient } from "../../../config/supabase.js";
import { COOKIE_NAMES } from "../../../services/utils/cookies.js";
import { fail, ok } from "../../../services/utils/response.js";
import { meUseCase } from "../../usecases/authUseCase/meUseCase.js";

export default async function meController(req, res) {
    try {
        const access = req.cookies[COOKIE_NAMES.access];
        if (!access) return fail(res, 'Unauthorized', 401);
        const userClient = makeUserClient(access);

        const { data, error, status } = await meUseCase(userClient);
        if (error) return fail(res, error, status || 401);

        return ok(res, data);
    } catch (e) {
        return fail(res, 'Failed to load profile', 500, { detail: e?.message });
    }
}