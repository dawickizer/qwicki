// Import dependencies
import { Router } from 'express';
import { isAuthenticatedJWT } from '../middleware/auth';
import { requestBody } from '../middleware/log';
import SocialService from '../services/social-service';

const router = Router();

const socialService: SocialService = new SocialService();

router.post(
  '/send-friend-request',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.sendFriendRequest(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  '/accept-friend-request/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.acceptFriendRequest(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  '/reject-friend-request/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.rejectFriendRequest(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  '/revoke-friend-request/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.revokeFriendRequest(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.delete(
  '/remove-friend/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.removeFriend(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  '/send-message',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.sendMessage(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.get(
  '/get-messages-between/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.getMessagesBetweenAndPopulate(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.get(
  '/has-unviewed-messages/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.hasUnviewedMessages(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

router.put(
  '/mark-unviewed-messages-as-viewed/:id',
  [isAuthenticatedJWT, requestBody],
  async (req: any, res: any) => {
    try {
      res.send(await socialService.markUnviewedMessagesAsViewed(req));
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  }
);

export default router;
