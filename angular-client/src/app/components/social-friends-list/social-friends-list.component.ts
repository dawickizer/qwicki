// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { User } from 'src/app/models/user/user';
// import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
// import { SocialService } from 'src/app/services/social/social.service';
// import * as Colyseus from 'colyseus.js';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { Message } from 'src/app/models/message/message';

// @Component({
//   selector: 'app-social-friends-list',
//   templateUrl: './social-friends-list.component.html',
//   styleUrls: ['./social-friends-list.component.css'],
// })
// export class SocialFriendsListComponent {
//   @Input() title: string;
//   @Input() titleColor: string;
//   @Input() potentialMessage: Message;

//   @Input() friends: MatTableDataSource<User>;
//   @Output() friendsChange: EventEmitter<MatTableDataSource<User>> =
//     new EventEmitter();

//   friendsDisplayedColumns: string[] = ['username'];

//   constructor(
//     private socialService: SocialService,
//     private colyseusService: ColyseusService,
//     private snackBar: MatSnackBar
//   ) {}

//   dropFriends(event: CdkDragDrop<string[]>) {
//     moveItemInArray(this.friends.data, event.previousIndex, event.currentIndex);
//     this.friends._updateChangeSubscription();
//   }

//   onRemoveFriend(friend: User) {
//     this.socialService.removeFriend(friend).subscribe({
//       next: async host => {
//         this.colyseusService.host = new User(host);
//         const room: Colyseus.Room =
//           this.colyseusService.onlineFriendsRooms.find(
//             room => room.id === friend._id
//           );
//         if (room) {
//           room.send('removeFriend', host);
//           this.colyseusService.leaveRoom(room);
//         } else {
//           this.colyseusService.hostRoom.send('disconnectFriend', friend);
//         }
//         this.updateFriends();
//         this.openSnackBar('Unfriended ' + friend.username, 'Dismiss');
//       },
//       error: error => this.openSnackBar(error, 'Dismiss'),
//     });
//   }

//   private updateFriends() {
//     this.friends.data =
//       this.title === 'online'
//         ? this.colyseusService.host.onlineFriends
//         : this.colyseusService.host.offlineFriends;
//     this.friends._updateChangeSubscription();
//   }

//   openSnackBar(message: string, action: string) {
//     this.snackBar.open(message, action, {
//       duration: 5000,
//     });
//   }
// }
