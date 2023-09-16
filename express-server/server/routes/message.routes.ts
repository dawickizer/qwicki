import { Router } from 'express';
import {
  getMessagesBetweenUsers,
  sendMessage,
  getMessageById,
} from '../controllers/message.controller';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', [isAuthenticatedJWT, requestBody], getMessagesBetweenUsers);
router.post('/', [isAuthenticatedJWT, requestBody], sendMessage);
router.get('/:messageId', [isAuthenticatedJWT, requestBody], getMessageById);

export default router;
