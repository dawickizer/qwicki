import { Client } from "colyseus";
import { SocialRoom } from "../rooms/SocialRoom";
import { SocialManager } from "./SocialManager";

export class FriendManager extends SocialManager {

    constructor(socialRoom: SocialRoom) {
        super(socialRoom);
    }

    setOnMessageListeners() {
        this.socialRoom.onMessage("sendFriendRequest", (client, friendRequest) => {
            this.socialRoom.hostClient.send("sendFriendRequest", friendRequest);
        });
    
        this.socialRoom.onMessage("acceptFriendRequest", (client, friendRequest) => {
            this.socialRoom.hostClient.send("acceptFriendRequest", friendRequest);
        });
    
        this.socialRoom.onMessage("rejectFriendRequest", (client, friendRequest) => {
            this.socialRoom.hostClient.send("rejectFriendRequest", friendRequest);
        });
    
        this.socialRoom.onMessage("revokeFriendRequest", (client, friendRequest) => {
            this.socialRoom.hostClient.send("revokeFriendRequest", friendRequest);
        });
    
        this.socialRoom.onMessage("removeFriend", (client, friend) => {
            this.socialRoom.hostClient.send("removeFriend", friend);
        });
    
        this.socialRoom.onMessage("disconnectFriend", (client, friend) => {
            let user = this.socialRoom.getUserById(friend._id);
            let userClient: Client = this.socialRoom.getClient(user);
            userClient.send("disconnectFriend", this.socialRoom.state.host);
            userClient.leave();
        });
    }
}
