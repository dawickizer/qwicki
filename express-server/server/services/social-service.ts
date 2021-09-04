import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';
import { User } from '../models/user';
import UserService from './user-service';

// This class is responsible for handling social operations 
class SocialService {

    // create UserService
    userService: UserService = new UserService();

    async friendRequest(req: any): Promise<User | null> {

        let toFriend: Friend = new Friend();
        let toUser: User | null = new User();
        let fromFriend: Friend = new Friend();
        let fromUser: User | null = new User(); 
        let friendRequest: FriendRequest = new FriendRequest();
    
        // retrieve the to user by username if they exist
        toUser = await this.userService.getByUsername(req.body.username);
        fromUser = await this.userService.get(req.body.decodedJWT._id);
    
        if (toUser && fromUser) {
 
            if (this.alreadySentFriendRequest(toUser, req.body.decodedJWT)) throw Error('You already sent a friend request to this user');
            if (this.isFriends(toUser, req.body.decodedJWT)) throw Error('You already are friends with this user');

            // update 'to user' id and username (case sensitive)
            toFriend._id = toUser._id;
            toFriend.username = toUser.username as string;
    
            // update 'from user' id and username (case sensitive)
            fromFriend._id = req.body.decodedJWT._id;
            fromFriend.username = req.body.decodedJWT.username;
    
            // update friend request with 'to' and 'from' friends
            friendRequest.to = toFriend;
            friendRequest.from = fromFriend;
    
            // handle friend request metadata
            friendRequest.createdAt = new Date();
            friendRequest.accepted = false;
    
            // update the 'to user' inbound friend requests
            toUser.inboundFriendRequests.push(friendRequest);
            toUser.friends.push(friendRequest.from);
    
            // update the 'from user' outbound friend requests
            fromUser.outboundFriendRequests.push(friendRequest);
            fromUser.friends.push(friendRequest.to);
    
            // persist the updated to user
            toUser = await this.userService.put(friendRequest.to._id, toUser as User);
    
            // persist the updated from user
            fromUser = await this.userService.put(friendRequest.from._id, fromUser as User);

            return fromUser;
        } else throw Error('User does not exist');
    }

    private alreadySentFriendRequest(toUser: User, fromUser: any): boolean {
        let flag = false;
        for (let request of toUser.inboundFriendRequests) {
            if (request.from._id == fromUser._id) {
                flag = true;
                return flag;
            } 
        }
        return flag;
    }

    private isFriends(toUser: User, fromUser: any): boolean {
        let flag = false;
        for (let friend of toUser.friends) {
            if (friend._id == fromUser._id) {
                flag = true;
                return flag;
            } 
        }
        return flag;
    }

    private isBlocked(toUser: User, fromUser: any): boolean {
        let flag = false;
        return flag;
    }
}

export default SocialService;
