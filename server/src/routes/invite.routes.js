import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendInviteController } from '../handlers/controllers/authControllers/inviteController.js';
import { activateController } from '../handlers/controllers/authControllers/activateController.js';
import { validateInviteController } from '../handlers/controllers/authControllers/validateInviteController.js';

const inviteRouter = Router();

inviteRouter.post('/send', requireAuth, requireRole('ADMIN'), sendInviteController);
// inviteRouter.post('/send', sendInviteController);

inviteRouter.post('/activate', activateController);
inviteRouter.post('/validate', validateInviteController)

export default inviteRouter;
