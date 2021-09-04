import { FriendRequest } from '../models/friend-request';
import { User } from '../models/user';
import UserService from './user-service';

// This class is responsible for handling social operations 
class SocialService {

    // create UserService
    userService: UserService = new UserService();

    async handleFriendRequest(req: any): Promise<User | null> {

        let toUser: User | null = new User();
        let fromUser: User | null = new User(); 
        let friendRequest: FriendRequest = new FriendRequest();
    
        // retrieve the to user by username if they exist
        toUser = await this.userService.getByUsername(req.body.username);
        fromUser = await this.userService.get(req.body.decodedJWT._id);
    
        if (toUser && fromUser) {

            // Check friend request eligibility
            if (toUser.friends.includes(fromUser._id)) throw Error('You already are friends with this user');
            for (let fromUserOutboundFriendRequest of fromUser.outboundFriendRequests) 
                 if (toUser.inboundFriendRequests.includes(fromUserOutboundFriendRequest))
                    throw Error('You already sent a friend request to this user');

            // update friend request with 'to' and 'from' friends ids
            friendRequest.to = toUser._id;
            friendRequest.from = fromUser._id;
    
            // handle friend request metadata
            friendRequest.createdAt = new Date();
            friendRequest.accepted = false;
    
            // update the 'to user' inbound friend request ids
            toUser.inboundFriendRequests.push(friendRequest._id);
            toUser.friends.push(friendRequest.from);
    
            // update the 'from user' outbound friend request ids
            fromUser.outboundFriendRequests.push(friendRequest._id);
            fromUser.friends.push(friendRequest.to);
    
            // persist the friend request
            friendRequest = await this.createFriendRequest(friendRequest);

            // persist the updated to user
            toUser = await this.userService.put(friendRequest.to, toUser);
    
            // persist the updated from user
            fromUser = await this.userService.putAndPopulateFriends(friendRequest.from, fromUser);

            return fromUser;
        } else throw Error('User does not exist');
    }

    async createFriendRequest(friendRequest: FriendRequest): Promise<FriendRequest> {
        return await FriendRequest.create(friendRequest);
    }
}

export default SocialService;
