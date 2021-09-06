// Import dependencies
import { Router } from 'express';
import { isAuthenticatedJWT } from '../middleware/auth';
import { requestBody } from '../middleware/log';
import SocialService from '../services/social-service';

const router = Router();

// create UserService
let socialService: SocialService = new SocialService();

// handle friend request
router.post('/friend-request', [isAuthenticatedJWT, requestBody], async (req: any, res: any) => {
    try {
        res.send(await socialService.handleFriendRequest(req));
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.delete('/remove-friend/:id', [isAuthenticatedJWT, requestBody], async (req: any, res: any) => {
    try {
        res.send(await socialService.removeFriend(req));
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// router.post('/add-friend', [isAuthenticatedJWT, requestBody], async (req: any, res: any) => {
//     try {
//         res.send(await socialService.handleFriendRequest(req));
//     } catch (error: any) {
//         res.status(500).send(error.message);
//     }
// });

export default router;
