import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'src/app/models/message/message';
import { User } from 'src/app/models/user/user';
import { SocialService } from 'src/app/services/social/social.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  @Input() host: User;
  @Input() friend: User;
  @Output() remove: EventEmitter<User> = new EventEmitter();

  newMessage: string = '';
  messagesDisplayedColumns: string[] = ['message'];
  messages = new MatTableDataSource<Message>([] as Message[]);

  constructor(
    private snackBar: MatSnackBar,
    private socialService: SocialService) { }

  ngOnInit(): void {
    this.socialService.getMessagesBetween(this.friend).subscribe({
      next: async (messages: Message[]) => {
        this.messages.data = messages;
      }, 
      error: error => {
        this.openSnackBar(error, 'Dismiss');
      }
    });
  }

  sendMessage(event?: any) {

    // prevent that text area from causing an expand event
    if (event) event.preventDefault();

    // if text is empty dont do anything
    if (this.newMessage && this.newMessage !== '') {

      let message: Message = new Message();
      message.content = this.newMessage;
      message.to = this.friend;

      this.socialService.sendMessage(message).subscribe({
        next: async (message: Message) => {
          this.socialService.getMessagesBetween(this.friend).subscribe({
            next: async (messages: Message[]) => {
              this.messages.data = messages;
              this.messages._updateChangeSubscription();
              this.newMessage = '';
            }, 
            error: error => {
              this.newMessage = '';
              this.openSnackBar(error, 'Dismiss');
            }
          });
        }, 
        error: error => {
          this.newMessage = '';
          this.openSnackBar(error, 'Dismiss');
        }
      });
      
    }
  }

  removeFriend() {
    this.remove.emit(this.friend);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

}
