import { Room, Client } from "colyseus";
import { ChatRoomState } from "../schemas/ChatRoomState";
import { isAuthenticatedJWT } from "../middleware/auth";
import http from 'http';
import { User } from "../schemas/User";
import { ChatRoom } from "../rooms/ChatRoom";


export class ChatRoomService {

    chatRoom: ChatRoom;

    constructor(chatRoom: ChatRoom) {
        this.chatRoom = chatRoom;
    }

    setOnMessageListeners() {
        // set room listeners
        this.chatRoom.onMessage("sendFriendRequest", (client, friendRequest) => {
            this.chatRoom.hostClient.send("sendFriendRequest", friendRequest);
        });
  
        this.chatRoom.onMessage("acceptFriendRequest", (client, friendRequest) => {
            this.chatRoom.hostClient.send("acceptFriendRequest", friendRequest);
        });
  
        this.chatRoom.onMessage("rejectFriendRequest", (client, friendRequest) => {
            this.chatRoom.hostClient.send("rejectFriendRequest", friendRequest);
        });
  
        this.chatRoom.onMessage("revokeFriendRequest", (client, friendRequest) => {
            this.chatRoom.hostClient.send("revokeFriendRequest", friendRequest);
        });
  
        this.chatRoom.onMessage("removeFriend", (client, friend) => {
            this.chatRoom.hostClient.send("removeFriend", friend);
        });
  
        this.chatRoom.onMessage("disconnectFriend", (client, friend) => {
            this.chatRoom.state.users.forEach(user => {
                if (user._id === friend._id) {
                    let userClient: Client = this.getUserClient(user);
                    userClient.send("disconnectFriend", this.chatRoom.state.host);
                    this.chatRoom.state.users.delete(userClient.sessionId);
                    userClient.leave();
                }
            });
        });
  
        this.chatRoom.onMessage("messageHost", (client, message) => {
            this.chatRoom.hostClient.send("messageHost", message);
        });
  
        this.chatRoom.onMessage("messageUser", (client, message) => {
            this.chatRoom.state.users.forEach(user => {
                if (user._id === message.to._id) {
                    let userClient: Client = this.getUserClient(user);
                    userClient.send("messageUser", message);
                }
            });
        });
    }

    getHostClient(): Client {
        return this.getUserClient(this.chatRoom.state.host);
    }

    private getUserClient(user: User): Client {
        return this.chatRoom.clients.find(client => client.sessionId === user.sessionId)
    }

}
