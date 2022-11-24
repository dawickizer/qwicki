import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user/user';
import { SocialService } from 'src/app/services/social/social.service';
import * as Colyseus from 'colyseus.js';

@Component({
  selector: 'app-social-cell',
  templateUrl: './social-cell.component.html',
  styleUrls: ['./social-cell.component.css']
})
export class SocialCellComponent implements OnInit {

  @Input() host: User;
  @Output() hostChange: EventEmitter<User> = new EventEmitter();

  @Input() hostRoom: Colyseus.Room;
  @Output() hostRoomChange: EventEmitter<Colyseus.Room> = new EventEmitter();

  @Input() onlineFriendsRooms: Colyseus.Room[];
  @Output() onlineFriendsRoomsChange: EventEmitter<Colyseus.Room[]> = new EventEmitter();

  @Input() friend: User;
  @Output() friendChange: EventEmitter<User> = new EventEmitter();

  @Output() onRemoveFriend: EventEmitter<User> = new EventEmitter();

  hasUnviewedMessages: boolean = false;
  panelOpenState: boolean = false;

  constructor(private socialService: SocialService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.unviewedMessageAlert();
  }

  asyncDataPresent() {
    return (this.host && this.hostRoom && this.onlineFriendsRooms && this.friend);
  }

  unviewedMessageAlert() {
    if (!this.panelOpenState) {
      this.socialService.hasUnviewedMessages(this.friend).subscribe({
        next: async (hasUnviewedMessages: boolean) => {
          this.hasUnviewedMessages = hasUnviewedMessages;
        }, 
        error: error => this.openSnackBar(error, 'Dismiss')
      });
    }
  }

  onPanelOpen() {
    this.panelOpenState = true;
    this.socialService.markUnviewedMessagesAsViewed(this.friend).subscribe({
      next: async (hasUnviewedMessages: boolean) => {
        this.hasUnviewedMessages = hasUnviewedMessages;
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  onPanelClose() {
    this.panelOpenState = false;
  }

  removeFriend() {
    this.onRemoveFriend.emit(this.friend);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

}
