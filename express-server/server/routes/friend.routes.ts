import { Router } from 'express';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import {
  addFriendForUser,
  removeFriendFromUser,
} from '../controllers/friend.controller';

const router = Router({ mergeParams: true });

router.post('/', [isAuthenticatedJWT, requestBody], addFriendForUser);
router.delete(
  '/:friendId',
  [isAuthenticatedJWT, requestBody],
  removeFriendFromUser
);

export default router;
