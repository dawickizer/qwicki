import { Router } from 'express';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import {
  addFriendForUser,
  deleteFriendFromUser,
} from '../controllers/friend.controller';

const router = Router({ mergeParams: true });

router.post('/', [isAuthenticatedJWT, requestBody], addFriendForUser);
router.delete(
  '/:friendId',
  [isAuthenticatedJWT, requestBody],
  deleteFriendFromUser
);

export default router;
