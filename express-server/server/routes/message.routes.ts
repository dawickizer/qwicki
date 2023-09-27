import { Router } from 'express';
import {
  getMessagesBetweenUsers,
  sendMessage,
  getMessageById,
} from '../controllers/message.controller';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/:friendId', [isAuthenticatedJWT, requestBody], getMessagesBetweenUsers);
router.post('/:friendId', [isAuthenticatedJWT, requestBody], sendMessage);
router.get('/:friendId/:messageId', [isAuthenticatedJWT, requestBody], getMessageById);

export default router;
