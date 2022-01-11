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
import * as Colyseus from 'colyseus.js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly client = new Colyseus.Client(environment.COLYSEUS_CHAT);

  @ViewChild('drawer') drawer: MatSidenav;

  friendsDisplayedColumns: string[] = ['username', 'delete', 'send'];
  onlineFriends = new MatTableDataSource<User>([] as User[]);
  offlineFriends = new MatTableDataSource<User>([] as User[]);

  friendRequestsDisplayedColumns: string[] = ['username', 'reject', 'accept'];
  friendRequests = new MatTableDataSource<FriendRequest>([] as FriendRequest[]);

  user: User = new User();
  potentialFriend: string = '';

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private keyBindService: KeyBindService,
    private authService: AuthService,
    private userService: UserService,
    private socialService: SocialService) { }

  ngOnInit() {
    this.authService.currentUser()
    .subscribe(user => this.userService.get(user._id)
    .subscribe(async user => {

      // get user data
      this.user = user;
      this.updateFriends();
      this.updateFriendRequests();

      // onJoin let the host know you are online
      try {
        let availableRooms = await this.client.getAvailableRooms();
        let room: Colyseus.Room;
        let friendsRooms: Colyseus.Room[] = [];
        let hasExistingRoom: boolean = availableRooms.some(availableRoom => availableRoom.roomId === user._id)

        // create chat room instance for people who log on after you to be able to join (host broadcasts to everyone)
        if (hasExistingRoom) room = await this.client.joinById(user._id, {accessToken: this.authService.currentUserJWT()});
        else room = await this.client.create("chat_room", {accessToken: this.authService.currentUserJWT()}); 

        // join your friends room instances to get connected with them (client messages only host)
        this.onlineFriends.data.forEach(async friend => friendsRooms.push(await this.client.joinById(friend._id, {accessToken: this.authService.currentUserJWT()})));

        // TODO:
        // when host user disconnects from room..kick everyone and close the room
        // need to think of when to set online to true/false
        
        // room.onMessage("hello", (message) => {
        //   console.log("message received from server");
        //   console.log(message);
        // });

        // room.onError((code, message) => {
        //   console.log("oops, error ocurred:");
        //   console.log(message);
        // });
  
        // room.send('type', `Hello from ${this.user.username}`);
        // console.log(room.state)
  
      } catch (e) {
        console.error("join error", e);
      }

    }));
    this.handleSideNavKeyBind();
  }



  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  send() {
    console.log('send')
  }

  removeFriend(friend: User) {
    this.socialService.removeFriend(friend).subscribe(user => {
      this.user = user;
      this.updateFriends();
      this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');   
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  sendFriendRequest() {
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe(user => {
      this.user = user;
      this.updateFriends();
      this.openSnackBar('Friend request sent to ' + this.potentialFriend, 'Dismiss');   
      this.potentialFriend = '';
    }, error => {
      this.openSnackBar(error, 'Dismiss');
      this.potentialFriend = '';
    });
  }

  acceptFriendRequest(friendRequest: FriendRequest) {
    this.socialService.acceptFriendRequest(friendRequest).subscribe(user => {
      this.user = user;
      this.updateFriends();
      this.updateFriendRequests();
      this.openSnackBar(`You and ${friendRequest.from.username} are now friends` , 'Dismiss');   
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  rejectFriendRequest(friendRequest: FriendRequest) {
    this.socialService.rejectFriendRequest(friendRequest).subscribe(user => {
      this.user = user;
      this.updateFriends();
      this.updateFriendRequests();
      this.openSnackBar(`Rejected ${friendRequest.from.username}'s friend request` , 'Dismiss');   
    }, error => this.openSnackBar(error, 'Dismiss'));
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
