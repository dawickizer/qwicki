import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { UserService } from 'src/app/services/user/user.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Message } from 'src/app/models/message/message';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css']
})
export class SocialSidenavComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;

  onlineFriends = new MatTableDataSource<User>([] as User[]);
  offlineFriends = new MatTableDataSource<User>([] as User[]);

  inboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);
  outboundFriendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  potentialMessage: Message = new Message();
  isAsyncDataPresent: boolean = false;
  update: FriendRequest;

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private keyBindService: KeyBindService,
    public authService: AuthService,
    public colyseusService: ColyseusService,
    private userService: UserService) { }

  ngOnInit() {
    this.authService.currentUser()
    .subscribe(user => this.userService.get(user._id)
    .subscribe(async user => {
      await this.establishConnections(user);
      this.updateFriends();
      this.updateFriendRequests();
      this.isAsyncDataPresent = true;
    }));
    this.handleSideNavKeyBind();
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  async establishConnections(user: User) {
    await this.colyseusService.establishHost(user, this.authService.currentUserJWT());
    this.setHostRoomListeners();
    await this.colyseusService.establishOnlineFriendsRooms();
    this.setOnlineFriendsRoomsListeners();
  }

  setHostRoomListeners() {
    this.colyseusService.hostRoom.onMessage("online", (user: any) => this.handleOnlineEvent(user));
    this.colyseusService.hostRoom.onMessage("offline", (user: any) => this.handleOfflineEvent(user));
    this.colyseusService.hostRoom.onMessage("sendFriendRequest", (friendRequest: FriendRequest) => this.handleSendFriendRequestEvent(friendRequest));
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

  onSendFriendRequest(friendRequest: FriendRequest) {
    this.update = friendRequest;
  }

  onAcceptFriendRequest() {
    this.setOnlineFriendsRoomsListeners();
    this.updateFriends();
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

  private handleSendFriendRequestEvent(friendRequest: FriendRequest) {
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

  private handleMessageHostEvent(message: Message) {
    this.potentialMessage = message;
  }

  private handleMessageUserEvent(message: Message) {
    this.potentialMessage = message;
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
