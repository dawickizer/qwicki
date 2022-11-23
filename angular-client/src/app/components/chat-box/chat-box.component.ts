import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  newMessage: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private socialService: SocialService) { }

  ngOnInit(): void {}

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
              console.log(messages);
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

}
