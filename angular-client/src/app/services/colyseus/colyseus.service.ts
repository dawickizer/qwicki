import { Injectable, OnInit } from '@angular/core';
import * as Colyseus from 'colyseus.js';
import { User } from 'src/app/models/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColyseusService implements OnInit {

  public client = new Colyseus.Client(environment.COLYSEUS_CHAT);
  public user: User;
  public userJWT: any;
  public onlineFriends: User[] = [];
  public offlineFriends: User[] = [];
  public userRoom: Colyseus.Room;
  public availableRooms: any;
  public onlineFriendsRooms: Colyseus.Room[] = [];
  public hasExistingRoom: boolean;

  constructor() { }

  ngOnInit() {}

  async startSession(user: User, userJWT: any) {
    try {
      this.user = user;
      this.userJWT = userJWT;
      this.updateFriends();
      await this.connectToUserRoom();
      await this.connectToOnlineFriendsRooms(); //prob doesnt actually await due to promise loop..prob need to use Promise.all() in the function
      this.debug();

      // TODO:
      // think about implications of setting host if multiple browser tabs are open
      // what happens when you accept friend request? Prob should join the friends room if they are online
  
      } catch (e) {
        console.error("join error", e);
      }
  }

  async connectToUserRoom() {
  
    this.availableRooms = await this.client.getAvailableRooms();
    this.hasExistingRoom = this.availableRooms.some((availableRoom: any) => availableRoom.roomId === this.user._id);

    // create chat room instance for people who log on after you to be able to join (host broadcasts to everyone)
    if (this.hasExistingRoom) this.userRoom = await this.client.joinById(this.user._id, {accessToken: this.userJWT});
    else {
      this.userRoom = await this.client.create("chat_room", {accessToken: this.userJWT});
    }

    // error listener
    this.userRoom.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
  
  }

  async connectToOnlineFriendsRooms() {
    this.onlineFriends.forEach(async friend => this.onlineFriendsRooms.push(await this.client.joinById(friend._id, {accessToken: this.userJWT})));
  }

  updateUser(user: User) {
    this.user = user;
    this.updateFriends();
  }

  updateFriends() {
    this.onlineFriends = this.user.friends.filter(friend => friend.online);
    this.offlineFriends = this.user.friends.filter(friend => !friend.online); 
  }

  leaveAllRooms() {
    if (this.userRoom) this.userRoom.leave();
    this.onlineFriendsRooms.forEach((room: Colyseus.Room) => room.leave());
  }

  debug() {
    this.userRoom.onStateChange((state) => {
      console.log(state)
    })
  }
}

