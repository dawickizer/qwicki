import { Router } from 'express';
import {
  unviewedMessagesCount,
  getMessages,
  markMessagesAsViewed,
  createMessage,
} from '../controllers/message.controller';
import { requestBody } from '../middleware/log.middleware';
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get(
  '/:friendId',
  [isAuthenticated, isAuthorized, requestBody],
  getMessages
);
router.post(
  '/:friendId',
  [isAuthenticated, isAuthorized, requestBody],
  createMessage
);
router.get(
  '/:friendId/unviewed',
  [isAuthenticated, isAuthorized, requestBody],
  unviewedMessagesCount
);
router.put(
  '/:friendId/viewed',
  [isAuthenticated, isAuthorized, requestBody],
  markMessagesAsViewed
);

export default router;
