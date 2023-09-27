import { Router } from 'express';
import friendRoutes from './friend.routes';
import friendRequestRoutes from './friend-request.routes';
import messageRoutes from './message.routes';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from '../controllers/user.controller';
import { isAuthenticatedJWT } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router();

router.post('/', [isAuthenticatedJWT, requestBody], createUser);
router.get('/', [isAuthenticatedJWT, requestBody], getAllUsers);
router.get('/:userId', [isAuthenticatedJWT, requestBody], getUserById);
router.put('/:userId', [isAuthenticatedJWT, requestBody], updateUserById);
router.delete('/:userId', [isAuthenticatedJWT, requestBody], deleteUserById);

router.use('/:userId/friends', friendRoutes);
router.use('/:userId/friend-requests', friendRequestRoutes);
router.use('/:userId/messages', messageRoutes);

export default router;
