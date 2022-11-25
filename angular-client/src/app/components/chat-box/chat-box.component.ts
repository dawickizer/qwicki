import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'src/app/models/message/message';
import { User } from 'src/app/models/user/user';
import { SocialService } from 'src/app/services/social/social.service';
import * as Colyseus from 'colyseus.js';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {

  @ViewChild('scrollable') scrollable: ElementRef;

  @Input() host: User;
  @Output() hostChange: EventEmitter<User> = new EventEmitter();

  @Input() hostRoom: Colyseus.Room;
  @Output() hostRoomChange: EventEmitter<Colyseus.Room> = new EventEmitter();

  @Input() onlineFriendsRooms: Colyseus.Room[];
  @Output() onlineFriendsRoomsChange: EventEmitter<Colyseus.Room[]> = new EventEmitter();

  @Input() friend: User;
  @Output() friendChange: EventEmitter<User> = new EventEmitter();
  

  @Output() onRemoveFriend: EventEmitter<User> = new EventEmitter();
  @Output() onUnviewedMessage: EventEmitter<boolean> = new EventEmitter();

  newMessage: string = '';
  messagesDisplayedColumns: string[] = ['message'];
  messages = new MatTableDataSource<Message>([] as Message[]);

  constructor(
    private snackBar: MatSnackBar,
    private socialService: SocialService) { }

  ngOnInit(): void {
    this.socialService.getMessagesBetween(this.friend).subscribe({
      next: async (messages: Message[]) => {
        this.messages.data = this.addEmptyMessages(messages);
        this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
      }, 
      error: error => {
        this.openSnackBar(error, 'Dismiss');
      }
    });
  }

  asyncDataPresent() {
    return (this.host && this.hostRoom && this.onlineFriendsRooms && this.friend);
  }

  handleMessageHostEvent(message: Message) {
    console.log("MESSAGE TO HOST")
    this.unviewedMessageAlert();
    this.messages.data = this.addEmptyMessages([...this.messages.data, message]);
    this.messages._updateChangeSubscription();
    this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
  }

  handleMessageUserEvent(message: Message) {
    console.log("MESSAGE TO USER")
    this.unviewedMessageAlert();
    this.messages.data = this.addEmptyMessages([...this.messages.data, message]);
    this.messages._updateChangeSubscription();
    this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
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

              let room: Colyseus.Room = this.onlineFriendsRooms.find(room => room.id === message.to._id);
              if (room) {
                room.send("messageHost", message);
              } else {
                this.hostRoom.send("messageUser", message);
              }
              this.unviewedMessageAlert();
              this.messages.data = this.addEmptyMessages(messages);
              this.messages._updateChangeSubscription();
              this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
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
    this.onRemoveFriend.emit(this.friend);
  }

  unviewedMessageAlert() {
    this.onUnviewedMessage.emit(true);
  }

  addEmptyMessages(messages: Message[]): Message[] {
    let emptyMessage: Message = new Message();
    emptyMessage.content = '';
    if (messages.length < 1) {
      messages.unshift(emptyMessage);
      messages.unshift(emptyMessage);
      messages.unshift(emptyMessage);
    } else if (messages.length < 2) {
      messages.unshift(emptyMessage);
      messages.unshift(emptyMessage);
    } else if (messages.length < 3) {
      messages.unshift(emptyMessage);
    }
    return messages;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

}
