import { Router } from 'express';
import {
  createInvite,
  deleteInviteById,
  getInvitesByUserId,
} from '../controllers/invite.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router({ mergeParams: true });

router.get(
  '/',
  [isAuthenticated, isAuthorized, requestBody],
  getInvitesByUserId
);

router.post('/', [isAuthenticated, isAuthorized, requestBody], createInvite);
router.delete(
  '/:inviteId',
  [isAuthenticated, isAuthorized, requestBody],
  deleteInviteById
);

export default router;
