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

  friendsDisplayedColumns: string[] = ['username'];
  onlineFriends = new MatTableDataSource<User>([] as User[]);
  offlineFriends = new MatTableDataSource<User>([] as User[]);

  inboundFriendRequestsDisplayedColumns: string[] = ['username', 'action'];
  inboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  outboundFriendRequestsDisplayedColumns: string[] = ['username', 'action'];
  outboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  potentialFriend: string = '';
  isAsyncDataPresent: boolean = false;

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private keyBindService: KeyBindService,
    private authService: AuthService,
    public colyseusService: ColyseusService,
    private userService: UserService,
    private socialService: SocialService) { }

  ngOnInit() {
    this.authService.currentUser()
    .subscribe(user => this.userService.get(user._id)
    .subscribe(async user => {
      await this.colyseusService.establishHost(user, this.authService.currentUserJWT());
      this.setHostRoomListeners();
      await this.colyseusService.establishOnlineFriendsRooms();
      this.setOnlineFriendsRoomsListeners();
      this.updateFriends();
      this.updateFriendRequests();
      this.isAsyncDataPresent = true;
    }));
    this.handleSideNavKeyBind();
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  setHostRoomListeners() {
    this.colyseusService.hostRoom.onMessage("online", (user: any) => this.handleOnlineEvent(user));
    this.colyseusService.hostRoom.onMessage("offline", (user: any) => this.handleOfflineEvent(user));
    this.colyseusService.hostRoom.onMessage("inboundFriendRequest", (friendRequest: FriendRequest) => this.handleInboundFriendRequestEvent(friendRequest));
    this.colyseusService.hostRoom.onMessage("acceptFriendRequest", (friendRequest: FriendRequest) => this.handleAcceptFriendRequestEvent(friendRequest));
    this.colyseusService.hostRoom.onMessage("rejectFriendRequest", (friendRequest: FriendRequest) => this.handleRejectFriendRequestEvent(friendRequest));
    this.colyseusService.hostRoom.onMessage("revokeFriendRequest", (friendRequest: FriendRequest) => this.handleRevokeFriendRequestEvent(friendRequest));
    this.colyseusService.hostRoom.onMessage("removeFriend", (removeFriend: User) => this.handleRemoveFriendEvent(removeFriend));
    this.colyseusService.hostRoom.onMessage("messageHost", (message: Message) => this.handleMessageHostEvent(message));
    this.colyseusService.hostRoom.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
  }

  setOnlineFriendsRoomsListeners() {
    this.colyseusService.onlineFriendsRooms.forEach(room => {
      room.onMessage("offline", (user: any) => this.handleOfflineEvent(user));
      room.onMessage("dispose", (id: string) => this.handleDisposeEvent(id));
      room.onMessage("disconnectFriend", (disconnectFriend: User) => this.handleDisconnectFriendEvent(disconnectFriend));
      room.onMessage("messageUser", (message: Message) => this.handleMessageUserEvent(message));
      room.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
    });
  }

  potentialMessage: Message = new Message();
  private handleMessageHostEvent(message: Message) {
    this.potentialMessage = message;
  }

  private handleMessageUserEvent(message: Message) {
    this.potentialMessage = message;
  }

  sendFriendRequest() {
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
      next: async host => {
        this.colyseusService.host = new User(host);
        let friendRequest: FriendRequest = this.findOutboundFriendRequest();
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.to);
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
        this.colyseusService.host = new User(host);
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.from);
        if (room) {
          room.send("acceptFriendRequest", friendRequest);
          this.colyseusService.onlineFriendsRooms.push(room);
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
        this.colyseusService.host = new User(host);
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.from);
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
        this.colyseusService.host = new User(host);
        let room: Colyseus.Room = await this.colyseusService.joinExistingRoomIfPresent(friendRequest.to);
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
        this.colyseusService.host = new User(host);
        let room: Colyseus.Room = this.colyseusService.onlineFriendsRooms.find(room => room.id === friend._id);
        if (room) {
          room.send("removeFriend", host);
          this.colyseusService.leaveRoom(room);
        } else {
          this.colyseusService.hostRoom.send("disconnectFriend", friend);
        }
        this.updateFriends();
        this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');   
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  private updateFriends() {
    this.onlineFriends.data = this.colyseusService.host.onlineFriends;
    this.onlineFriends._updateChangeSubscription();
    this.offlineFriends.data = this.colyseusService.host.offlineFriends;
    this.offlineFriends._updateChangeSubscription();
  }

  private updateFriendRequests() {
    this.inboundFriendRequests.data = this.colyseusService.host.inboundFriendRequests;
    this.inboundFriendRequests._updateChangeSubscription();  
    this.outboundFriendRequests.data = this.colyseusService.host.outboundFriendRequests;
    this.outboundFriendRequests._updateChangeSubscription();  
  }

  private findOutboundFriendRequest(): FriendRequest {
    return this.colyseusService.host.outboundFriendRequests.find(friendRequest => friendRequest.to.username.toLowerCase() === this.potentialFriend.toLowerCase());
  }

  private setOnlineStatusOfFriend(user: any, online: boolean) {
    if (this.colyseusService.host._id !== user._id) {
      let friend: User = this.findFriend(user._id);
      if (friend) {
        friend.online = online;
        this.updateFriends();
      }
    }
  }

  private findFriend(id: string): User {
    return this.colyseusService.host.friends.find(friend => friend._id === id);
  }

  private handleOnlineEvent(user: any) {
    this.setOnlineStatusOfFriend(user, true);
  }

  private handleOfflineEvent(user: any) {
    this.setOnlineStatusOfFriend(user, false);
  }

  private handleInboundFriendRequestEvent(friendRequest: FriendRequest) {
    this.colyseusService.host.inboundFriendRequests.push(friendRequest);
    this.updateFriendRequests();
  }

  private handleAcceptFriendRequestEvent(friendRequest: FriendRequest) {
    friendRequest.to.online = true;
    this.colyseusService.host.friends.push(friendRequest.to);
    this.colyseusService.host.outboundFriendRequests = this.colyseusService.host.outboundFriendRequests.filter(outboundFriendRequest => outboundFriendRequest.to._id !== friendRequest.to._id);
    this.updateFriends();
    this.updateFriendRequests();
  }

  private handleRejectFriendRequestEvent(friendRequest: FriendRequest) {
    this.colyseusService.host.friends = this.colyseusService.host.friends.filter(friend => friend._id !== friendRequest.to._id);
    this.colyseusService.host.outboundFriendRequests = this.colyseusService.host.outboundFriendRequests.filter(outboundFriendRequest => outboundFriendRequest.to._id !== friendRequest.to._id);
    this.updateFriends();
    this.updateFriendRequests();
  }

  private handleRevokeFriendRequestEvent(friendRequest: FriendRequest) {
    this.colyseusService.host.friends = this.colyseusService.host.friends.filter(friend => friend._id !== friendRequest.from._id);
    this.colyseusService.host.inboundFriendRequests = this.colyseusService.host.inboundFriendRequests.filter(inboundFriendRequest => inboundFriendRequest.from._id !== friendRequest.from._id);
    this.updateFriends();
    this.updateFriendRequests();
  }

  private handleRemoveFriendEvent(removeFriend: User) {
    this.colyseusService.host.friends = this.colyseusService.host.friends.filter(friend => friend._id !== removeFriend._id);
    this.updateFriends();
  }

  private handleDisconnectFriendEvent(disconnectFriend: User) {
    this.colyseusService.host.friends = this.colyseusService.host.friends.filter(friend => friend._id !== disconnectFriend._id);
    this.updateFriends();
    this.colyseusService.removeRoomById(disconnectFriend._id);
  }

  private handleDisposeEvent(id: string) {
    this.colyseusService.removeRoomById(id);
  }

  filter(filterValue: any) {
    this.onlineFriends.filterPredicate = (friend, filter) => friend.username.trim().toLowerCase().includes(filter);
    this.onlineFriends.filter = filterValue.target.value.trim().toLowerCase();

    this.offlineFriends.filterPredicate = (friend, filter) => friend.username.trim().toLowerCase().includes(filter);
    this.offlineFriends.filter = filterValue.target.value.trim().toLowerCase();

    this.inboundFriendRequests.filterPredicate = (friendRequest, filter) => friendRequest.from.username.trim().toLowerCase().includes(filter);
    this.inboundFriendRequests.filter = filterValue.target.value.trim().toLowerCase();

    this.outboundFriendRequests.filterPredicate = (friendRequest, filter) => friendRequest.to.username.trim().toLowerCase().includes(filter);
    this.outboundFriendRequests.filter = filterValue.target.value.trim().toLowerCase();
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
