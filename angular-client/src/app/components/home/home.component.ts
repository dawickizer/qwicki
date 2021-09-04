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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;

  displayedColumns: string[] = ['name', 'delete', 'send'];
  dataSource = new MatTableDataSource<Friend>([] as Friend[]);

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
      this.dataSource.data = this.user.friends;
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
    let index = this.user.friends.indexOf(friend);
    this.user.friends.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.userService.update(this.user).subscribe(user => {
      this.user = user;
      this.dataSource.data = this.user.friends;
    }, error => console.log(error));
  }

  sendFriendRequest() {

    // use social service to send friend request
    this.socialService.sendFriendRequest(this.potentialFriend).subscribe(user => {
      this.user = user;
      this.dataSource.data = this.user.friends;
      this.dataSource._updateChangeSubscription();  
      this.openSnackBar('Friend request sent to ' + this.potentialFriend, 'Dismiss');   
      console.log(this.user);
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  filter(filterValue: any) {
    this.dataSource.filterPredicate = (friend, filter) => friend.username.trim().toLowerCase().includes(filter);
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
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
