import { fail } from "../../../services/utils/response";
import { landingUseCase } from "../../usecases/authUseCase/landingUseCase";

export default async function landingController(req, res) {
    try {
        const access_token = req.cookies['access_token'];
        if (!access_token) return fail(res, 'Something went wrong. Try again', 400);


        const result = await landingUseCase(access_token);
        if (!result.ok) {
            return res.redirect(result.url);
        }
        return res.redirect(result.url);
    } catch (e) {
        console.error("Error in landingController:", e);
        return res.redirect("http://localhost:3000/login");
    }
}