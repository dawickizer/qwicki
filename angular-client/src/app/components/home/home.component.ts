import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { Friend } from 'src/app/models/friend/friend';
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
  onlineFriends = new MatTableDataSource<Friend>([] as Friend[]);
  offlineFriends = new MatTableDataSource<Friend>([] as Friend[]);

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

  ngOnInit(): void {
    this.authService.currentUser()
    .subscribe(user => this.userService.get(user._id)
    .subscribe(user => {
      this.user = user;
      this.updateFriends();
      this.updateFriendRequests();
    }));
    this.handleSideNavKeyBind();

    this.client.joinOrCreate('my_room');
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  send() {
    console.log('send')
  }

  removeFriend(friend: Friend) {
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
