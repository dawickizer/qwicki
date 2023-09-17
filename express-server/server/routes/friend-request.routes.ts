import { Router } from 'express';
import {
  createFriendRequest,
  deleteFriendRequestById,
} from '../controllers/friend-request.controller';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router({ mergeParams: true });

router.post('/', [isAuthenticatedJWT, requestBody], createFriendRequest);
router.delete(
  '/:friendRequestId',
  [isAuthenticatedJWT, requestBody],
  deleteFriendRequestById
);

export default router;
