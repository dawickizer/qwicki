import { Router } from 'express';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import { addFriend, removeFriend } from '../controllers/friend.controller';

const router = Router({ mergeParams: true });

router.post('/', [isAuthenticatedJWT, requestBody], addFriend);
router.delete('/:friendId', [isAuthenticatedJWT, requestBody], removeFriend);

export default router;
