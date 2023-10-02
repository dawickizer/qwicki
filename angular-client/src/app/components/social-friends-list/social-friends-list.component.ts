import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Friend } from 'src/app/models/friend/friend';
import { FriendsStateService } from 'src/app/state/friends/friends.state.service';

@Component({
  selector: 'app-social-friends-list',
  templateUrl: './social-friends-list.component.html',
  styleUrls: ['./social-friends-list.component.css'],
})
export class SocialFriendsListComponent {
  @Input() friends: MatTableDataSource<Friend>;

  friendsDisplayedColumns: string[] = ['username'];

  constructor(private friendsStateService: FriendsStateService) {}

  dropFriend(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.friends.data, event.previousIndex, event.currentIndex);
    this.friends._updateChangeSubscription();
    this.friendsStateService.setFriends(this.friends.data);
  }
}
