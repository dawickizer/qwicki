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
import { Message } from 'src/app/models/message/message';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css']
})
export class SocialSidenavComponent implements OnInit {

  @ViewChild('drawer') drawer: MatSidenav;

  friendsDisplayedColumns: string[] = ['username', 'delete', 'send'];
  onlineFriends = new MatTableDataSource<User>([] as User[]);
  offlineFriends = new MatTableDataSource<User>([] as User[]);

  inboundFriendRequestsDisplayedColumns: string[] = ['username', 'reject', 'accept'];
  inboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  outboundFriendRequestsDisplayedColumns: string[] = ['username', 'reject'];
  outboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  host: User = new User();
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
      this.setHost(user);

      this.host.friends.push({_id: '123', username: '012345x 012345x'} as User);
      this.host.friends.push({_id: '123', username: 'Hodoo Prophet'} as User);
      this.host.friends.push({_id: '123', username: 'Sandman'} as User);
      this.host.friends.push({_id: '123', username: 'Queen Bee'} as User);
      this.host.friends.push({_id: '123', username: 'xCrime_-Time'} as User);
      this.host.friends.push({_id: '123', username: 'xCrime_-Phantom'} as User);
      this.host.friends.push({_id: '123', username: 'AmericasFreshest'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);
      this.host.friends.push({_id: '123', username: 'TEST USER'} as User);

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
    this.hostRoom = await this.colyseusService.createRoom(this.host, this.authService.currentUserJWT());
    this.setHostRoomListeners();
  }

  setHostRoomListeners() {
    this.hostRoom.onMessage("online", (user: any) => this.handleOnlineEvent(user));
    this.hostRoom.onMessage("offline", (user: any) => this.handleOfflineEvent(user));
    this.hostRoom.onMessage("inboundFriendRequest", (friendRequest: FriendRequest) => this.handleInboundFriendRequestEvent(friendRequest));
    this.hostRoom.onMessage("acceptFriendRequest", (friendRequest: FriendRequest) => this.handleAcceptFriendRequestEvent(friendRequest));
    this.hostRoom.onMessage("rejectFriendRequest", (friendRequest: FriendRequest) => this.handleRejectFriendRequestEvent(friendRequest));
    this.hostRoom.onMessage("revokeFriendRequest", (friendRequest: FriendRequest) => this.handleRevokeFriendRequestEvent(friendRequest));
    this.hostRoom.onMessage("removeFriend", (removeFriend: User) => this.handleRemoveFriendEvent(removeFriend));
    this.hostRoom.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
  }

  async connectToOnlineFriendsRooms() {
    this.onlineFriendsRooms = await this.colyseusService.connectToRooms(this.onlineFriends.data, this.authService.currentUserJWT());
    this.setOnlineFriendsRoomsListeners();
  }

  setOnlineFriendsRoomsListeners() {
    this.onlineFriendsRooms.forEach(room => {
      room.onMessage("offline", (user: any) => this.handleOfflineEvent(user));
      room.onMessage("dispose", (id: string) => this.handleDisposeEvent(id));
      room.onMessage("disconnectFriend", (disconnectFriend: User) => this.handleDisconnectFriendEvent(disconnectFriend));
      room.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
    });
  }

  open: boolean = false;
  sendMessage(friend: User) {

    // let message: Message = new Message();
    // message.content = "Hello"
    // message.to = friend;

    // this.socialService.sendMessage(message).subscribe({
    //   next: async (message: Message) => {
    //     this.socialService.getMessagesBetween(friend).subscribe({
    //       next: async (messages: Message[]) => {console.log(messages)}, 
    //       error: error => this.openSnackBar(error, 'Dismiss')
    //     });
    //   }, 
    //   error: error => this.openSnackBar(error, 'Dismiss')
    // });

    this.open = true;
  }

  setHost(host: User) {
    this.host = host;
  }

  sendFriendRequest() {
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
      next: async host => {
        this.setHost(host);
        let friendRequest: FriendRequest = this.findOutboundFriendRequest();
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.to, this.authService.currentUserJWT());
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
      next: async host => {
        this.setHost(host);
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.from, this.authService.currentUserJWT());
        if (room) {
          room.send("acceptFriendRequest", friendRequest);
          this.onlineFriendsRooms.push(room);
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
      next: async host => {
        this.setHost(host);
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.from, this.authService.currentUserJWT());
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

  revokeFriendRequest(friendRequest: FriendRequest) {
    this.socialService.revokeFriendRequest(friendRequest).subscribe({
      next: async host => {
        this.setHost(host);
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.to, this.authService.currentUserJWT());
        if (room) {
          room.send("revokeFriendRequest", friendRequest);
          this.colyseusService.leaveRoom(room);
        }
        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar(`Revoked ${friendRequest.to.username}'s friend request` , 'Dismiss');   
      },
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  removeFriend(friend: User) {
    this.socialService.removeFriend(friend).subscribe({
      next: async host => {
        this.setHost(host);
        let room: Colyseus.Room = this.onlineFriendsRooms.find(room => room.id === friend._id);
        if (room) {
          room.send("removeFriend", host);
          this.onlineFriendsRooms = this.onlineFriendsRooms.filter(room => room.id !== friend._id);
          this.colyseusService.leaveRoom(room);
        } else {
          this.hostRoom.send("disconnectFriend", friend);
        }
        this.updateFriends();
        this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');   
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  private updateFriends() {
    this.onlineFriends.data = this.host.friends.filter(friend => friend.online);
    this.offlineFriends.data = this.host.friends.filter(friend => !friend.online);
    this.onlineFriends._updateChangeSubscription();
    this.offlineFriends._updateChangeSubscription();   
  }

  private updateFriendRequests() {
    this.inboundFriendRequests.data = this.host.inboundFriendRequests;
    this.inboundFriendRequests._updateChangeSubscription();  
    this.outboundFriendRequests.data = this.host.outboundFriendRequests;
    this.outboundFriendRequests._updateChangeSubscription();  
  }

  private findOutboundFriendRequest(): FriendRequest {
    return this.host.outboundFriendRequests.find(friendRequest => friendRequest.to.username.toLowerCase() === this.potentialFriend.toLowerCase());
  }

  private setOnlineStatusOfFriend(user: any, online: boolean) {
    if (this.host._id !== user._id) {
      let friend: User = this.findFriend(user._id);
      if (friend) {
        friend.online = online;
        this.updateFriends();
      }
    }
  }

  private findFriend(id: string): User {
    return this.host.friends.find(friend => friend._id === id);
  }


  private handleOnlineEvent(user: any) {
    this.setOnlineStatusOfFriend(user, true);
  }

  private handleOfflineEvent(user: any) {
    this.setOnlineStatusOfFriend(user, false);
  }

  private handleInboundFriendRequestEvent(friendRequest: FriendRequest) {
    this.host.inboundFriendRequests.push(friendRequest);
    this.updateFriendRequests();
  }

  private handleAcceptFriendRequestEvent(friendRequest: FriendRequest) {
    friendRequest.to.online = true;
    this.host.friends.push(friendRequest.to);
    this.host.outboundFriendRequests = this.host.outboundFriendRequests.filter(outboundFriendRequest => outboundFriendRequest.to._id !== friendRequest.to._id);
    this.updateFriends();
    this.updateFriendRequests();
  }

  private handleRejectFriendRequestEvent(friendRequest: FriendRequest) {
    this.host.friends = this.host.friends.filter(friend => friend._id !== friendRequest.to._id);
    this.host.outboundFriendRequests = this.host.outboundFriendRequests.filter(outboundFriendRequest => outboundFriendRequest.to._id !== friendRequest.to._id);
    this.updateFriends();
    this.updateFriendRequests();
  }

  private handleRevokeFriendRequestEvent(friendRequest: FriendRequest) {
    this.host.friends = this.host.friends.filter(friend => friend._id !== friendRequest.from._id);
    this.host.inboundFriendRequests = this.host.inboundFriendRequests.filter(inboundFriendRequest => inboundFriendRequest.from._id !== friendRequest.from._id);
    this.updateFriends();
    this.updateFriendRequests();
  }

  private handleRemoveFriendEvent(removeFriend: User) {
    this.host.friends = this.host.friends.filter(friend => friend._id !== removeFriend._id);
    this.updateFriends();
  }

  private handleDisconnectFriendEvent(disconnectFriend: User) {
    this.host.friends = this.host.friends.filter(friend => friend._id !== disconnectFriend._id);
    this.updateFriends();
    this.onlineFriendsRooms = this.onlineFriendsRooms.filter(room => room.id !== disconnectFriend._id);
    this.colyseusService.removeRoomById(disconnectFriend._id);
  }

  private handleDisposeEvent(id: string) {
    this.onlineFriendsRooms = this.onlineFriendsRooms.filter(room => room.id !== id);
    this.colyseusService.removeRoomById(id);
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
