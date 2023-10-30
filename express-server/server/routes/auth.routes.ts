import { Router } from 'express';

import { isAuthenticated } from '../middleware/auth.middleware';
import { requestBody } from '../middleware/log.middleware';
import {
  currentUser,
  isLoggedIn,
  login,
  logout,
  signup,
} from '../controllers/auth.controller';

const router = Router();

router.post('/login', [requestBody], login);
router.post('/signup', [requestBody], signup);
router.post('/is-logged-in', [requestBody], isLoggedIn);
router.post('/logout', [isAuthenticated, requestBody], logout);
router.post('/current-user', [isAuthenticated, requestBody], currentUser);

export default router;
