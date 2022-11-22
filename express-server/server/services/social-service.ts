import { FriendRequest } from '../models/friend-request';
import { Message } from '../models/message';
import { User } from '../models/user';
import UserService from './user-service';

// This class is responsible for handling social operations 
class SocialService {

    // create UserService
    userService: UserService = new UserService();

    async sendFriendRequest(req: any): Promise<User | null> {

        let toUser: User | null = new User();
        let fromUser: User | null = new User(); 
        let friendRequest: FriendRequest = new FriendRequest();
    
        // retrieve the to user by username if they exist
        toUser = await this.userService.getByUsername(req.body.username);
        fromUser = await this.userService.get(req.body.decodedJWT._id);
    
        if (toUser && fromUser) {

            // Check friend request eligibility (could add blocked logic later)
            if (toUser.id === fromUser.id) throw Error('You cannot send a friend request to yourself');
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
    
            // update the users friend request ids
            toUser.inboundFriendRequests.push(friendRequest._id);
            fromUser.outboundFriendRequests.push(friendRequest._id);
    
            // persist the friend request
            friendRequest = await this.createFriendRequest(friendRequest);

            // persist the updated to user
            toUser = await this.userService.put(friendRequest.to, toUser);
    
            // persist the updated from user
            fromUser = await this.userService.putAndPopulateChildren(friendRequest.from, fromUser);

            return fromUser;
        } else throw Error('User does not exist');
    }

    async createFriendRequest(friendRequest: FriendRequest): Promise<FriendRequest> {
        return await FriendRequest.create(friendRequest);
    }

    async acceptFriendRequest(req: any): Promise<User | null> {

        let requestor: User | null = new User();
        let requested: User | null = new User(); 
        let friendRequestId: any;

        // retrieve the users and friend request id
        requestor = await this.userService.get(req.body.decodedJWT._id);
        requested = await this.userService.get(req.params.id);
        friendRequestId = req.body.friendRequestId;

        // if they exist add each other to each others' friend list and remove the active friend request
        if (requestor && requested) {

            // confirm friend request really exists between the two users
            if (!requestor.inboundFriendRequests.includes(friendRequestId) &&
            !requested.outboundFriendRequests.includes(friendRequestId)) 
                throw Error('A friend request does not exist between you and the other user')

            requestor.friends.push(requested._id);
            requested.friends.push(requestor._id);

            requestor.inboundFriendRequests.splice(requestor.inboundFriendRequests.indexOf(friendRequestId), 1);
            requested.outboundFriendRequests.splice(requested.outboundFriendRequests.indexOf(friendRequestId), 1);

            requestor = await this.userService.putAndPopulateChildren(requestor._id, requestor);
            requested = await this.userService.put(requested._id, requested);

            return requestor;
        } else throw Error('User does not exist');
    }

    async rejectFriendRequest(req: any): Promise<User | null> {

        let requestor: User | null = new User();
        let requested: User | null = new User(); 
        let friendRequestId: any;

        // retrieve the users and friend request id
        requestor = await this.userService.get(req.body.decodedJWT._id);
        requested = await this.userService.get(req.params.id);
        friendRequestId = req.body.friendRequestId;

        // if they exist add each other to each others' friend list and remove the active friend request
        if (requestor && requested) {

            // confirm friend request really exists between the two users
            if (!requestor.inboundFriendRequests.includes(friendRequestId) &&
            !requested.outboundFriendRequests.includes(friendRequestId)) 
                throw Error('A friend request does not exist between you and the other user')

            requestor.inboundFriendRequests.splice(requestor.inboundFriendRequests.indexOf(friendRequestId), 1);
            requested.outboundFriendRequests.splice(requested.outboundFriendRequests.indexOf(friendRequestId), 1);

            requestor = await this.userService.putAndPopulateChildren(requestor._id, requestor);
            requested = await this.userService.put(requested._id, requested);

            return requestor;
        } else throw Error('User does not exist');
    }

    async revokeFriendRequest(req: any): Promise<User | null> {

        let requestor: User | null = new User();
        let requested: User | null = new User(); 
        let friendRequestId: any;

        // retrieve the users and friend request id
        requestor = await this.userService.get(req.body.decodedJWT._id);
        requested = await this.userService.get(req.params.id);
        friendRequestId = req.body.friendRequestId;

        // if they exist add each other to each others' friend list and remove the active friend request
        if (requestor && requested) {

            // confirm friend request really exists between the two users
            if (!requestor.outboundFriendRequests.includes(friendRequestId) &&
            !requested.inboundFriendRequests.includes(friendRequestId)) 
                throw Error('A friend request does not exist between you and the other user')

            requestor.outboundFriendRequests.splice(requestor.outboundFriendRequests.indexOf(friendRequestId), 1);
            requested.inboundFriendRequests.splice(requested.inboundFriendRequests.indexOf(friendRequestId), 1);

            requestor = await this.userService.putAndPopulateChildren(requestor._id, requestor);
            requested = await this.userService.put(requested._id, requested);

            return requestor;
        } else throw Error('User does not exist');
    }

    async removeFriend(req: any): Promise<User | null> {

        let requestor: User | null = new User();
        let requested: User | null = new User(); 

        // retrieve the users
        requestor = await this.userService.get(req.body.decodedJWT._id);
        requested = await this.userService.get(req.params.id);

        // if they exist remove each other from each others' friend list
        if (requestor && requested) {
            requestor.friends.splice(requestor.friends.indexOf(requested._id), 1);
            requested.friends.splice(requested.friends.indexOf(requestor._id), 1);

            requestor = await this.userService.putAndPopulateChildren(requestor._id, requestor);
            requested = await this.userService.put(requested._id, requested);

            return requestor;
        } else throw Error('User does not exist');
    }

    async sendMessage(req: any): Promise<Message | null> {
        let message: Message = new Message();
        let toUser: User | null = await this.userService.get(req.body.message.to._id);
        let fromUser: User | null = await this.userService.get(req.body.decodedJWT._id);
    
        if (toUser && fromUser) {

            // Check message eligibility (could add blocked logic later)
            if (toUser.id === fromUser.id) throw Error('You cannot message yourself');
            if (!fromUser.friends.includes(toUser._id)) throw Error('You cannot send a message to someone that is not your friend');

            // update message with 'to' and 'from' friends ids
            message.to = toUser._id;
            message.from = fromUser._id;
    
            // handle message metadata
            message.createdAt = new Date();
            message.content = req.body.message.content;
    
            // persist the message
            message = await this.createMessage(message);

            return message;
        } else throw Error('User does not exist');
    }

    async createMessage(message: Message): Promise<Message> {
        return await Message.create(message);
    }

    async getMessagesBetween(req: any): Promise<Message[]> {   
        let requestor: User | null = await this.userService.get(req.body.decodedJWT._id);
        let requested: User | null = await this.userService.get(req.params.id);
        return await Message.find({ $or: [
            {$and: [{ to: requestor._id }, { from: requested._id }]},
            {$and: [{ to: requested._id }, { from: requestor._id }]}
          ]
        }).sort('-createdAt');
    }
}

export default SocialService;
