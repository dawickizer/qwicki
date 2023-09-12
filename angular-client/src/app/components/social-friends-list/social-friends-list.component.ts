import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Friend } from 'src/app/models/friend/friend';
import { UserStateService } from 'src/app/state/user/user.state.service';

@Component({
  selector: 'app-social-friends-list',
  templateUrl: './social-friends-list.component.html',
  styleUrls: ['./social-friends-list.component.css'],
})
export class SocialFriendsListComponent {
  @Input() title: string;
  @Input() titleColor: string;

  @Input() friends: MatTableDataSource<Friend>;

  friendsDisplayedColumns: string[] = ['username'];

  constructor(private userStateService: UserStateService) {}

  dropFriend(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.friends.data, event.previousIndex, event.currentIndex);
    this.friends._updateChangeSubscription();
    this.userStateService.setUserFriends(this.friends.data);
  }
}
