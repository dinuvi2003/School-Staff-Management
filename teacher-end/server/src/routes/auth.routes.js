import { Router } from 'express';
import loginController from '../handlers/controllers/authControllers/loginController.js';
import logoutController from '../handlers/controllers/authControllers/logoutController.js';
import refreshController from '../handlers/controllers/authControllers/refreshController.js';

const router = Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshController);


export default router;
