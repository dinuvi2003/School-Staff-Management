import { inviteRouter } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { sendInviteController } from '../handlers/controllers/authControllers/inviteController.js';
import { activateController } from '../handlers/controllers/authControllers/activateController.js';

const inviteRouter = inviteRouter();

inviteRouter.post('/send', requireAuth, requireRole('ADMIN'), sendInviteController);

inviteRouter.post('/activate', activateController);

export default inviteRouter;
