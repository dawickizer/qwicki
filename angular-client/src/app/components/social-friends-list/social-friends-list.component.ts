import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Friend } from 'src/app/models/friend/friend';

@Component({
  selector: 'app-social-friends-list',
  templateUrl: './social-friends-list.component.html',
  styleUrls: ['./social-friends-list.component.css'],
})
export class SocialFriendsListComponent {
  @Input() title: string;
  @Input() titleColor: string;

  @Input() friends: MatTableDataSource<Friend>;
  @Output() friendsChange: EventEmitter<MatTableDataSource<Friend>> =
    new EventEmitter();

  friendsDisplayedColumns: string[] = ['username'];

  constructor() {}

  dropFriends(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.friends.data, event.previousIndex, event.currentIndex);
    this.friends._updateChangeSubscription();
  }
}
