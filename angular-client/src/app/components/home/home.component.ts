import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Friend } from 'src/app/models/friend/friend';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { SocialService } from 'src/app/services/social/social.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;

  displayedColumns: string[] = ['name', 'delete', 'send'];
  onlineFriends = new MatTableDataSource<Friend>([] as Friend[]);
  offlineFriends = new MatTableDataSource<Friend>([] as Friend[]);

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
      this.onlineFriends.data = this.user.friends.filter(friend => friend.online);
      this.offlineFriends.data = this.user.friends.filter(friend => !friend.online);
    }));
    this.handleSideNavKeyBind();
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  send() {
    console.log('send')
  }

  removeFriend(friend: Friend) {

    // use social service to remove friend
    this.socialService.removeFriend(friend).subscribe(user => {
      this.user = user;
      this.onlineFriends.data = this.user.friends.filter(friend => friend.online);
      this.offlineFriends.data = this.user.friends.filter(friend => !friend.online);
      this.onlineFriends._updateChangeSubscription();
      this.offlineFriends._updateChangeSubscription();
      this.openSnackBar('Successfully unfriended ' + friend.username, 'Dismiss');   
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  sendFriendRequest() {

    // use social service to send friend request
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe(user => {
      this.user = user;
      this.onlineFriends.data = this.user.friends.filter(friend => friend.online);
      this.offlineFriends.data = this.user.friends.filter(friend => !friend.online);
      this.onlineFriends._updateChangeSubscription();
      this.offlineFriends._updateChangeSubscription();
      this.openSnackBar('Friend request sent to ' + this.potentialFriend, 'Dismiss');   
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  updateFriendsList() {
    this.onlineFriends.data = this.user.friends.filter(friend => friend.online);
    this.offlineFriends.data = this.user.friends.filter(friend => !friend.online);
    this.onlineFriends._updateChangeSubscription();
    this.offlineFriends._updateChangeSubscription();   
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
