import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css'],
})
export class GroupsListComponent implements OnInit {
  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.isAsyncDataPresent = true;
  }

  filter(filterValue: any) {
    console.log(filterValue);
    // this.onlineFriends.filterPredicate = (friend, filter) =>
    //   friend.username.trim().toLowerCase().includes(filter);
    // this.onlineFriends.filter = filterValue.target.value.trim().toLowerCase();
    // this.offlineFriends.filterPredicate = (friend, filter) =>
    //   friend.username.trim().toLowerCase().includes(filter);
    // this.offlineFriends.filter = filterValue.target.value.trim().toLowerCase();
    // this.inboundFriendRequests.filterPredicate = (friendRequest, filter) =>
    //   friendRequest.from.username.trim().toLowerCase().includes(filter);
    // this.inboundFriendRequests.filter = filterValue.target.value
    //   .trim()
    //   .toLowerCase();
    // this.outboundFriendRequests.filterPredicate = (friendRequest, filter) =>
    //   friendRequest.to.username.trim().toLowerCase().includes(filter);
    // this.outboundFriendRequests.filter = filterValue.target.value
    //   .trim()
    //   .toLowerCase();
  }
}
