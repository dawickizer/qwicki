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
import { isAuthenticated, isAuthorized } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';

const router = Router();

router.post('/', [isAuthenticated, requestBody], createUser); //prob need to lock this down as it gets all users and is open to any authenticated user
router.get('/', [isAuthenticated, requestBody], getAllUsers); //prob need to lock this down as it gets all users and is open to any authenticated user
router.get(
  '/:userId',
  [isAuthenticated, isAuthorized, requestBody],
  getUserById
);
router.put(
  '/:userId',
  [isAuthenticated, isAuthorized, requestBody],
  updateUserById
);
router.delete(
  '/:userId',
  [isAuthenticated, isAuthorized, requestBody],
  deleteUserById
);

router.use('/:userId/friends', friendRoutes);
router.use('/:userId/friend-requests', friendRequestRoutes);
router.use('/:userId/messages', messageRoutes);

export default router;
