import { Component, OnInit, Input } from '@angular/core';
import { Friend } from 'src/app/models/friend/friend';

@Component({
  selector: 'app-social-cell',
  templateUrl: './social-cell.component.html',
  styleUrls: ['./social-cell.component.css'],
})
export class SocialCellComponent implements OnInit {
  @Input() friend: Friend;

  hasUnviewedMessages = false;
  panelOpenState = false;

  ngOnInit(): void {
    this.onUnviewedMessage();
  }

  onUnviewedMessage() {
    // if (!this.panelOpenState) {
    //   this.socialService.hasUnviewedMessages(this.friend).subscribe({
    //     next: async (hasUnviewedMessages: boolean) => {
    //       this.hasUnviewedMessages = hasUnviewedMessages;
    //     },
    //     error: error => this.openSnackBar(error, 'Dismiss'),
    //   });
    // } else {
    //   this.socialService.markUnviewedMessagesAsViewed(this.friend).subscribe({
    //     next: async (hasUnviewedMessages: boolean) => {
    //       this.hasUnviewedMessages = hasUnviewedMessages;
    //     },
    //     error: error => this.openSnackBar(error, 'Dismiss'),
    //   });
    // }
  }

  onPanelOpen() {
    this.panelOpenState = true;
    // if (this.hasUnviewedMessages) {
    //   this.socialService.markUnviewedMessagesAsViewed(this.friend).subscribe({
    //     next: async (hasUnviewedMessages: boolean) => {
    //       this.hasUnviewedMessages = hasUnviewedMessages;
    //     },
    //     error: error => this.openSnackBar(error, 'Dismiss'),
    //   });
    // }
  }

  onPanelClose() {
    this.panelOpenState = false;
  }
}
