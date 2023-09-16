import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
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
  friends = new MatTableDataSource<Friend>([] as Friend[]);
  inboundFriendRequests = new MatTableDataSource<FriendRequest>(
    [] as FriendRequest[]
  );
  outboundFriendRequests = new MatTableDataSource<FriendRequest>(
    [] as FriendRequest[]
  );
  unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['username'];

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    this.subscribeToFriends();
    this.subscribeToFriendRequests();
  }

  subscribeToFriends() {
    this.userStateService.userFriends$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(friends => {
        // merge results to preserve old mem addresses which will make it so angular doesn't re-render the entire list, which can be
        // disruptive if you are interacting with the list. Ensure that the online field is updated on the current object as well
        this.friends.data = friends.map(friend => {
          const existingFriend = this.friends.data.find(
            f => f._id === friend._id
          );
          if (existingFriend) {
            // Check if onlineIndex or offlineIndex have changed
            if (existingFriend.online !== friend.online) {
              existingFriend.online = friend.online;
            }
            return existingFriend;
          } else {
            return friend;
          }
        });
        console.log(this.friends.data);
      });
  }

  subscribeToFriendRequests() {
    this.userStateService.userInboundFriendRequests$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(inboundFriendRequests => {
        this.inboundFriendRequests.data = inboundFriendRequests;
        console.log(this.inboundFriendRequests.data);
      });

    this.userStateService.userOutboundFriendRequests$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(outboundFriendRequests => {
        this.outboundFriendRequests.data = outboundFriendRequests;
        console.log(this.outboundFriendRequests.data);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  filter(filterValue: any) {
    this.friends.filterPredicate = (friend, filter) =>
      friend.username.trim().toLowerCase().includes(filter);
    this.friends.filter = filterValue.target.value.trim().toLowerCase();

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
