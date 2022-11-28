import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Message } from 'src/app/models/message/message';
import { User } from 'src/app/models/user/user';
import { SocialService } from 'src/app/services/social/social.service';
import * as Colyseus from 'colyseus.js';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';

@Component({
  selector: 'app-social-chat-box',
  templateUrl: './social-chat-box.component.html',
  styleUrls: ['./social-chat-box.component.css']
})
export class SocialChatBoxComponent implements OnInit {

  @ViewChild('scrollable') scrollable: ElementRef;
  @ViewChild('test') test: ElementRef;

  @Input() friend: User;
  @Output() friendChange: EventEmitter<User> = new EventEmitter();
  
  @Output() onRemoveFriend: EventEmitter<User> = new EventEmitter();
  @Output() onUnviewedMessage: EventEmitter<boolean> = new EventEmitter();

  private _potentialMessage: Message;
  @Input() set potentialMessage(message: Message) {
    this._potentialMessage = message;
    if (message && this.friend && message.from._id === this.friend._id) 
       this.handlePotentialMessage(message);
  }
 
  get potentialMessage(): Message {
     return this._potentialMessage;
  }

  private _panelOpenState: boolean;
  @Input() set panelOpenState(panelOpenState: boolean) {
    this._panelOpenState = panelOpenState;
    if (panelOpenState) this.setScrollHeight();
  }
 
  get panelOpenState(): boolean {
     return this._panelOpenState;
  }

  newMessage: string = '';
  messagesDisplayedColumns: string[] = ['message'];
  messages = new MatTableDataSource<Message>([] as Message[]);

  constructor(
    private colyseusService: ColyseusService,
    private snackBar: MatSnackBar,
    private socialService: SocialService) { }

  ngOnInit(): void {
    this.socialService.getMessagesBetween(this.friend).subscribe({
      next: async (messages: Message[]) => {
        this.messages.data = this.addEmptyMessages(messages);
        this.setScrollHeight();
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  handlePotentialMessage(message: Message) {
    this.unviewedMessageAlert();
    this.messages.data = this.addEmptyMessages([...this.messages.data, message]);
    this.messages._updateChangeSubscription();
    this.setScrollHeight();
  }

  setScrollHeight() {
    // wait 10ms to allow elementrefs to refresh..else the scroll height will be wrong
    setTimeout(() => this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight, 10) 
  }

  isMessageOld(message: Message): boolean {
    
    if (message.createdAt) {

      let today: Date = new Date();
      let messageDate = new Date(message.createdAt); 

      return (messageDate.getFullYear() < today.getFullYear()) || 
      (messageDate.getFullYear() == today.getFullYear() && messageDate.getMonth() < today.getMonth()) || 
      (messageDate.getFullYear() == today.getFullYear() && messageDate.getMonth() == today.getMonth() && messageDate.getDate() < today.getDate());
    }
    return false;
  }

  getParagraphs(message: Message) {
    let result = message?.content?.split('\n') ?? [];
    return result
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
          let room: Colyseus.Room = this.colyseusService.onlineFriendsRooms.find(room => room.id === message.to._id);
          if (room) {
            room.send("messageHost", message);
          } else {
            this.colyseusService.hostRoom.send("messageUser", message);
          }
          this.unviewedMessageAlert();
          this.messages.data = this.addEmptyMessages([...this.messages.data, message]);
          this.messages._updateChangeSubscription();
          this.setScrollHeight();
          this.newMessage = '';
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
      messages.unshift(emptyMessage);
    } else if (messages.length < 2) {
      messages.unshift(emptyMessage);
      messages.unshift(emptyMessage);
      messages.unshift(emptyMessage);
    } else if (messages.length < 3) {
      messages.unshift(emptyMessage);
      messages.unshift(emptyMessage);
    } else if (messages.length < 4) {
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