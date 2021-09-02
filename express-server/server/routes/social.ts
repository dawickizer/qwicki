// Import dependencies
import { Router } from 'express';
import { isAuthenticatedJWT, isAdmin, isAuthorized } from '../middleware/auth';
import { requestBody } from '../middleware/log';
import { FriendRequest } from '../models/friend-request';
import { User } from '../models/user';
import UserService from '../services/user-service';

const router = Router();

// create UserService
let userService: UserService = new UserService();

// handle friend request
router.post('/friend-request', [isAuthenticatedJWT, requestBody], async (req: any, res: any) => {

    // does to user exist in db by username?..if not kick back error
    // is from user blocked by to user?..if so kick back error
    // does to user already have a request?..if so dont do anything else

    let friendRequest: FriendRequest = {...req.body, decodedJWT: undefined};
    let toUser: User | null = await userService.getByUsername(friendRequest.to.username);
    friendRequest.to._id = toUser?._id;
    toUser?.inboundFriendRequests.push(friendRequest);
    let fromUser: User | null = await userService.get(friendRequest.from._id);
    fromUser?.outboundFriendRequests.push(friendRequest);
    fromUser = await userService.put(friendRequest.from._id, fromUser as User);
    toUser = await userService.put(friendRequest.to._id, toUser as User);
    res.send({friendRequest, fromUser, toUser});
});

export default router;
