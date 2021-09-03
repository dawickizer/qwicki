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

    // strip the decodedJWT from the req.body since its not needed for a friend request
    let friendRequest: FriendRequest = {...req.body, decodedJWT: undefined};

    // retrieve the to user by username if they exist
    let toUser: User | null = await userService.getByUsername(friendRequest.to.username);

    // update the friend request to contain the proper to user id and proper username (case sensitive)
    friendRequest.to._id = toUser?._id;
    friendRequest.to.username = toUser?.username as string;

    // update the to user inbound friend requests
    toUser?.inboundFriendRequests.push(friendRequest);

    // get the from user by id attached to the friend request
    let fromUser: User | null = await userService.get(friendRequest.from._id);

    // update the from user outbound friend requests and friends
    fromUser?.outboundFriendRequests.push(friendRequest);
    fromUser?.friends.push(friendRequest.to);

    // persist the updated from user
    fromUser = await userService.put(friendRequest.from._id, fromUser as User);

    // persist the updated to user
    toUser = await userService.put(friendRequest.to._id, toUser as User);

    // send a response 
    res.send(fromUser);
});

export default router;
