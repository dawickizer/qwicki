import { Router } from 'express';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import {
  addFriendForUser,
  deleteFriendFromUser,
  getAllFriendsForUser,
} from '../controllers/friend.controller';

const router = Router({ mergeParams: true });

// Routes specific to friends
router.get('/', [isAuthenticatedJWT, requestBody], getAllFriendsForUser);
router.post('/', [isAuthenticatedJWT, requestBody], addFriendForUser);
router.delete(
  '/:friendId',
  [isAuthenticatedJWT, requestBody],
  deleteFriendFromUser
);

export default router;
