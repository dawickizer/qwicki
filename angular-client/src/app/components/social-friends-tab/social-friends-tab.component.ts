import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';
import { Friend } from 'src/app/models/friend/friend';
import { Subject, takeUntil } from 'rxjs';
import { UserStateService } from 'src/app/state/user/user.state.service';

@Component({
  selector: 'app-social-friends-tab',
  templateUrl: './social-friends-tab.component.html',
  styleUrls: ['./social-friends-tab.component.css'],
})
export class SocialFriendsTabComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;

  onlineFriends = new MatTableDataSource<Friend>([] as Friend[]);
  offlineFriends = new MatTableDataSource<Friend>([] as Friend[]);

  inboundFriendRequests = new MatTableDataSource<FriendRequest>(
    [] as FriendRequest[]
  );
  outboundFriendRequests = new MatTableDataSource<FriendRequest>(
    [] as FriendRequest[]
  );

  isAsyncDataPresent = false;

  unsubscribe$ = new Subject<void>();

  displayedColumns: string[] = ['username'];
  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    this.userStateService.userOnlineFriends$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(onlineFriends => {
        this.onlineFriends.data = onlineFriends;
        console.log(this.onlineFriends.data);
      });

    this.userStateService.userOfflineFriends$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(offlineFriends => {
        this.offlineFriends.data = offlineFriends;
        console.log(this.offlineFriends.data);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSendFriendRequest(friendRequest: FriendRequest) {
    // dispatch send friend request action
    console.log(friendRequest);
  }

  onAcceptFriendRequest() {
    // dispatch accept friend request action
    console.log('Accept friend request');
  }

  filter(filterValue: any) {
    this.onlineFriends.filterPredicate = (friend, filter) =>
      friend.username.trim().toLowerCase().includes(filter);
    this.onlineFriends.filter = filterValue.target.value.trim().toLowerCase();

    this.offlineFriends.filterPredicate = (friend, filter) =>
      friend.username.trim().toLowerCase().includes(filter);
    this.offlineFriends.filter = filterValue.target.value.trim().toLowerCase();

    this.inboundFriendRequests.filterPredicate = (friendRequest, filter) =>
      friendRequest.from.username.trim().toLowerCase().includes(filter);
    this.inboundFriendRequests.filter = filterValue.target.value
      .trim()
      .toLowerCase();

    this.outboundFriendRequests.filterPredicate = (friendRequest, filter) =>
      friendRequest.to.username.trim().toLowerCase().includes(filter);
    this.outboundFriendRequests.filter = filterValue.target.value
      .trim()
      .toLowerCase();
  }
}
