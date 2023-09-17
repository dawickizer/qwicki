import { Router } from 'express';
import {
  createFriendRequest,
  deleteFriendRequest,
} from '../controllers/friend-request.controller';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router({ mergeParams: true });

router.post('/', [isAuthenticatedJWT, requestBody], createFriendRequest);
router.delete(
  '/:friendRequestId',
  [isAuthenticatedJWT, requestBody],
  deleteFriendRequest
);

export default router;
