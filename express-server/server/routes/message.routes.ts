import { Router } from 'express';
import {
  checkUnviewedMessages,
  getMessages,
  markMessagesAsViewed,
  createMessage,
} from '../controllers/message.controller';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/:friendId', [isAuthenticatedJWT, requestBody], getMessages);
router.post('/:friendId', [isAuthenticatedJWT, requestBody], createMessage);
router.get(
  '/:friendId/unviewed',
  [isAuthenticatedJWT, requestBody],
  checkUnviewedMessages
);
router.put(
  '/:friendId/viewed',
  [isAuthenticatedJWT, requestBody],
  markMessagesAsViewed
);

export default router;
