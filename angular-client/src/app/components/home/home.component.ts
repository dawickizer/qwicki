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

  friendRequestsDisplayedColumns: string[] = ['username', 'reject', 'accept'];
  friendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  user: User = new User();
  potentialFriend: string = '';

  userRoom: Colyseus.Room;
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
      await this.createUserRoom();
      await this.connectToOnlineFriendsRooms();
    }));
    this.handleSideNavKeyBind();
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  async createUserRoom() {
    this.userRoom = await this.colyseusService.createRoom(this.user, this.authService.currentUserJWT());
    this.setUserRoomListeners();
  }

  setUserRoomListeners() {
    this.userRoom.onMessage("online", data => {
      if (this.user._id !== data._id) {
        let friend: User = this.findFriend(data._id);
        friend.online = true;
        this.updateFriends();
      }
    });

    this.userRoom.onMessage("offline", data => {
      if (this.user._id !== data._id) {
        let friend: User = this.findFriend(data._id);
        friend.online = false;
        this.updateFriends();
      }
    });

    this.userRoom.onError((code, message) => console.log(`An error occurred with the room. Error Code: ${code} | Message: ${message}`));
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
          friend.online = false;
          this.updateFriends();
        }
      });

      room.onMessage("dispose", data => {
        this.colyseusService.removeRoomById(data);
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

  removeFriend(friend: User) {
    this.socialService.removeFriend(friend).subscribe({
      next: user => {
        this.setUser(user);
        this.updateFriends();
        this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');   
        this.potentialFriend = '';
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  sendFriendRequest() {
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe({
      next: user => {
        this.setUser(user);
        this.updateFriends();
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
      next: user => {
        this.setUser(user);
        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar(`You and ${friendRequest.from.username} are now friends` , 'Dismiss');   
      },
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialService.rejectFriendRequest(friendRequest).subscribe({
      next: user => {
        this.setUser(user);
        this.updateFriends();
        this.updateFriendRequests();
        this.openSnackBar(`Rejected ${friendRequest.from.username}'s friend request` , 'Dismiss');   
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
    this.friendRequests.data = this.user.inboundFriendRequests;
    this.friendRequests._updateChangeSubscription();  
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
