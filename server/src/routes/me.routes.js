import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const meRouter = Router();

meRouter.get("/me", requireAuth, (req, res) => {

    console.log("teacher req", req.user)
    return res.json({
        ok: true,
        data: {
            uid: req.user.uid,
            email: req.user.email,
            role: req.user.role,
            nic: req.user.nic,
            name: req.user.name,
            dp: req.user.dp
        }
    })
})

export default meRouter;