import { Router } from 'express';
import {
  getAllFriendRequests,
  createFriendRequest,
  deleteFriendRequest,
  acceptFriendRequest,
} from '../controllers/friend-request.controller';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router({ mergeParams: true });

router.get('/', [isAuthenticatedJWT, requestBody], getAllFriendRequests);
router.post('/', [isAuthenticatedJWT, requestBody], createFriendRequest);
router.delete(
  '/:friendRequestId',
  [isAuthenticatedJWT, requestBody],
  deleteFriendRequest
);
router.put(
  '/:friendRequestId/accept',
  [isAuthenticatedJWT, requestBody],
  acceptFriendRequest
);

export default router;
