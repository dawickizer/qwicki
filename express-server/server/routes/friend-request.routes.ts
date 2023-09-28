import { Router } from 'express';
import {
  createFriendRequest,
  deleteFriendRequestById,
} from '../controllers/friend-request.controller';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router({ mergeParams: true });

router.post(
  '/',
  [isAuthenticated, isAuthorized, requestBody],
  createFriendRequest
);
router.delete(
  '/:friendRequestId',
  [isAuthenticated, isAuthorized, requestBody],
  deleteFriendRequestById
);

export default router;
