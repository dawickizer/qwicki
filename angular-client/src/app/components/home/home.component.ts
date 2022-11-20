import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { SocialService } from 'src/app/services/social/social.service';
import { UserService } from 'src/app/services/user/user.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import * as Colyseus from 'colyseus.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly client = this.colyseusService.client;

  @ViewChild('drawer') drawer: MatSidenav;

  friendsDisplayedColumns: string[] = ['username', 'delete', 'send'];
  onlineFriends = new MatTableDataSource<User>([] as User[]);
  offlineFriends = new MatTableDataSource<User>([] as User[]);

  inboundFriendRequestsDisplayedColumns: string[] = ['username', 'reject', 'accept'];
  inboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  outboundFriendRequestsDisplayedColumns: string[] = ['username', 'reject'];
  outboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  user: User = new User();
  potentialFriend: string = '';

  hostRoom: Colyseus.Room;
  onlineFriendsRooms: Colyseus.Room[] = [];

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private keyBindService: KeyBindService,
    private authService: AuthService,
    private colyseusService: ColyseusService,
    private userService: UserService,
    private socialService: SocialService) { }

  ngOnInit() {
    this.authService.currentUser()
    .subscribe(user => this.userService.get(user._id)
    .subscribe(async user => {
      this.setUser(user);
      this.updateFriends();
      this.updateFriendRequests();
      await this.createHostRoom();
      await this.connectToOnlineFriendsRooms();
    }));
    this.handleSideNavKeyBind();
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  async createHostRoom() {
    this.hostRoom = await this.colyseusService.createRoom(this.user, this.authService.currentUserJWT());
    this.setHostRoomListeners();
  }

  setHostRoomListeners() {
    this.hostRoom.onMessage("online", data => {
      if (this.user._id !== data._id) {
        let friend: User = this.findFriend(data._id);
        if (friend) {
          friend.online = true;
          this.updateFriends();
        }
      }
    });

    this.hostRoom.onMessage("offline", data => {
      if (this.user._id !== data._id) {
        let friend: User = this.findFriend(data._id);
        if (friend) {
          friend.online = false;
          this.updateFriends();
        }
      }
    });

    this.hostRoom.onMessage("inboundFriendRequest", (friendRequest: FriendRequest) => {
      this.user.inboundFriendRequests.push(friendRequest);
      this.updateFriendRequests();
    });

    this.hostRoom.onMessage("acceptFriendRequest", (friendRequest: FriendRequest) => {
      friendRequest.to.online = true;
      this.user.friends.push(friendRequest.to);
      this.user.outboundFriendRequests = this.user.outboundFriendRequests.filter(outboundFriendRequest => outboundFriendRequest.to._id !== friendRequest.to._id);
      this.updateFriends();
      this.updateFriendRequests();
    });

    this.hostRoom.onMessage("rejectFriendRequest", (friendRequest: FriendRequest) => {
      this.user.friends = this.user.friends.filter(friend => friend._id !== friendRequest.to._id);
      this.user.outboundFriendRequests = this.user.outboundFriendRequests.filter(outboundFriendRequest => outboundFriendRequest.to._id !== friendRequest.to._id);
      this.updateFriends();
      this.updateFriendRequests();
    });

    this.hostRoom.onMessage("revokeFriendRequest", (friendRequest: FriendRequest) => {
      this.user.friends = this.user.friends.filter(friend => friend._id !== friendRequest.from._id);
      this.user.inboundFriendRequests = this.user.inboundFriendRequests.filter(inboundFriendRequest => inboundFriendRequest.from._id !== friendRequest.from._id);
      this.updateFriends();
      this.updateFriendRequests();
    });

    this.hostRoom.onMessage("removeFriend", (removeFriend: User) => {
      this.user.friends = this.user.friends.filter(friend => friend._id !== removeFriend._id);
      this.updateFriends();
    });

    this.hostRoom.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
  }

  async connectToOnlineFriendsRooms() {
    this.onlineFriendsRooms = await this.colyseusService.connectToRooms(this.onlineFriends.data, this.authService.currentUserJWT());
    this.setOnlineFriendsRoomsListeners();
  }

  setOnlineFriendsRoomsListeners() {
    this.onlineFriendsRooms.forEach(room => {
      room.onMessage("offline", data => {
        if (this.user._id !== data._id) {
          let friend: User = this.findFriend(data._id);
          if (friend) {
            friend.online = false;
            this.updateFriends();
          }
        }
      });

      room.onMessage("dispose", data => {
        this.colyseusService.removeRoomById(data);
      });

      room.onMessage("removeFriend", (removeFriend: User) => {
        this.user.friends = this.user.friends.filter(friend => friend._id !== removeFriend._id);
        this.updateFriends();
      });

      room.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
    });
  }

  send() {
    console.log('send')
  }

  setUser(user: User) {
    this.user = user;
  }

  // TO DO
  removeFriend(friend: User) {
    this.socialService.removeFriend(friend).subscribe({
      next: async user => {
        this.setUser(user);

        // am i in his room?
        let rooms: Colyseus.Room[] = this.onlineFriendsRooms.filter(room => room.id === friend._id);
        if (rooms.length === 1) {
          let room: Colyseus.Room = rooms[0];
          room.send("removeFriend", user);
          this.onlineFriendsRooms = this.onlineFriendsRooms.filter(room => room.id !== friend._id);
          this.colyseusService.leaveRoom(room);

        // is he in my room?
        } else {
          this.hostRoom.send("disconnectFriend", friend);
        }

        this.updateFriends();
        this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');   
        this.potentialFriend = '';
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  sendFriendRequest() {
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
      next: async user => {

        this.setUser(user);

        // get actual user id from list of friend requests based on username
        let friendRequest: FriendRequest = this.user.outboundFriendRequests.filter(friendRequest => friendRequest.to.username.toLowerCase() === this.potentialFriend.toLowerCase())[0];
        // is user online
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.to, this.authService.currentUserJWT());

        // if online send notification and leave
        if (room) {
          room.send("inboundFriendRequest", friendRequest);
          this.colyseusService.leaveRoom(room);
        }

        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar('Friend request sent to ' + this.potentialFriend, 'Dismiss');   
        this.potentialFriend = '';
      }, 
      error: error => {
        this.openSnackBar(error, 'Dismiss');
        this.potentialFriend = '';
      }
    });
  }

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.socialService.acceptFriendRequest(friendRequest).subscribe({
      next: async user => {

        this.setUser(user);

        // is user online
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.from, this.authService.currentUserJWT());

        // if online send notification
        if (room) {
          room.send("acceptFriendRequest", friendRequest);

          // jank
          this.onlineFriendsRooms.push(room);
          this.colyseusService.rooms.push(room);
          this.setOnlineFriendsRoomsListeners();
        }

        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar(`You and ${friendRequest.from.username} are now friends` , 'Dismiss');   
      },
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialService.rejectFriendRequest(friendRequest).subscribe({
      next: async user => {

        this.setUser(user);

        // is user online
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.from, this.authService.currentUserJWT());

        // if online send notification
        if (room) {
          room.send("rejectFriendRequest", friendRequest);
          this.colyseusService.leaveRoom(room);
        }

        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar(`Rejected ${friendRequest.from.username}'s friend request` , 'Dismiss');   
      },
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  // TO DO
  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialService.revokeFriendRequest(friendRequest).subscribe({
      next: async user => {

        // is user online
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.to, this.authService.currentUserJWT());

        // if online send notification
        if (room) {
          room.send("revokeFriendRequest", friendRequest);
          this.colyseusService.leaveRoom(room);
        }

        this.setUser(user);
        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar(`Revoked ${friendRequest.to.username}'s friend request` , 'Dismiss');   
      },
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  private updateFriends() {
    this.onlineFriends.data = this.user.friends.filter(friend => friend.online);
    this.offlineFriends.data = this.user.friends.filter(friend => !friend.online);
    this.onlineFriends._updateChangeSubscription();
    this.offlineFriends._updateChangeSubscription();   
  }

  private updateFriendRequests() {
    this.inboundFriendRequests.data = this.user.inboundFriendRequests;
    this.inboundFriendRequests._updateChangeSubscription();  

    this.outboundFriendRequests.data = this.user.outboundFriendRequests;
    this.outboundFriendRequests._updateChangeSubscription();  
  }

  private findFriend(id: string): User {
    return this.user.friends.find(friend => friend._id === id);
  }

  filter(filterValue: any) {
    this.onlineFriends.filterPredicate = (friend, filter) => friend.username.trim().toLowerCase().includes(filter);
    this.onlineFriends.filter = filterValue.target.value.trim().toLowerCase();

    this.offlineFriends.filterPredicate = (friend, filter) => friend.username.trim().toLowerCase().includes(filter);
    this.offlineFriends.filter = filterValue.target.value.trim().toLowerCase();
  }

  handleSideNavKeyBind() {
    this.keyBindService.setKeyBind('keydown', event => { 
      if (event.code == 'Tab') {
        event.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen();
        this.drawer.toggle();
      }
    });  
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
