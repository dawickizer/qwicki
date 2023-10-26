import { Router } from 'express';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import {
  addFriend,
  removeFriend,
  getFriendsByUserId,
} from '../controllers/friend.controller';

const router = Router({ mergeParams: true });

router.get(
  '/',
  [isAuthenticated, isAuthorized, requestBody],
  getFriendsByUserId
);
router.post('/', [isAuthenticated, isAuthorized, requestBody], addFriend);
router.delete(
  '/:friendId',
  [isAuthenticated, isAuthorized, requestBody],
  removeFriend
);

export default router;
