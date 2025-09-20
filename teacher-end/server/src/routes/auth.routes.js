import { Router } from 'express';
import loginController from '../handlers/controllers/authControllers/loginController.js';
import logoutController from '../handlers/controllers/authControllers/logoutController.js';
import refreshController from '../handlers/controllers/authControllers/refreshController.js';
import landingController from '../handlers/controllers/authControllers/landingController.js';

const router = Router();

router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/refresh', refreshController);
router.get('/landing', landingController);


export default router;
