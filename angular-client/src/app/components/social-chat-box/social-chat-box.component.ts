import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Friend } from 'src/app/state/friend/friend.model';
import { Message } from 'src/app/state/message/message.model';
import { MessageService } from 'src/app/state/message/message.service';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';

@Component({
  selector: 'app-social-chat-box',
  templateUrl: './social-chat-box.component.html',
  styleUrls: ['./social-chat-box.component.css'],
})
export class SocialChatBoxComponent implements OnInit, OnDestroy {
  @ViewChild('scrollable') scrollable: ElementRef;
  @ViewChild('test') test: ElementRef;

  @Input() friend: Friend;
  @Output() unviewedMessage: EventEmitter<boolean> = new EventEmitter();

  private _panelOpenState: boolean;
  @Input() set panelOpenState(panelOpenState: boolean) {
    this._panelOpenState = panelOpenState;
    if (panelOpenState) this.setScrollHeight();
  }

  get panelOpenState(): boolean {
    return this._panelOpenState;
  }

  newMessage = '';
  messagesDisplayedColumns: string[] = ['message'];
  messages = new MatTableDataSource<Message>([] as Message[]);

  unsubscribe$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
    private socialOrchestratorService: SocialOrchestratorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.socialOrchestratorService
      .getAllMessagesBetween(this.friend)
      .subscribe(messages => {
        this.messages.data = messages;
        this.setScrollHeight();
      });

    this.messageService
      .messagesByFriendId$(this.friend._id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(messages => {
        if (messages) {
          this.messages.data = messages;
          this.onUnviewedMessage();
          this.setScrollHeight();
          this.newMessage = '';
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setScrollHeight() {
    // wait 10ms to allow elementrefs to refresh..else the scroll height will be wrong
    setTimeout(
      () =>
        (this.scrollable.nativeElement.scrollTop =
          this.scrollable.nativeElement.scrollHeight),
      10
    );
  }

  isMessageOld(message: Message): boolean {
    if (message.createdAt) {
      const today: Date = new Date();
      const messageDate = new Date(message.createdAt);

      return (
        messageDate.getFullYear() < today.getFullYear() ||
        (messageDate.getFullYear() == today.getFullYear() &&
          messageDate.getMonth() < today.getMonth()) ||
        (messageDate.getFullYear() == today.getFullYear() &&
          messageDate.getMonth() == today.getMonth() &&
          messageDate.getDate() < today.getDate())
      );
    }
    return false;
  }

  getParagraphs(message: Message) {
    const result = message?.content?.split('\n') ?? [];
    return result;
  }

  sendMessage(event?: any) {
    // // prevent that text area from causing an expand event
    if (event) event.preventDefault();
    if (this.newMessage && this.newMessage !== '') {
      const message: Message = new Message();
      message.content = this.newMessage;
      message.to = this.friend;
      this.socialOrchestratorService
        .sendMessage(this.friend, message)
        .subscribe();
    }
  }

  removeFriend() {
    this.socialOrchestratorService.deleteFriend(this.friend).subscribe();
  }

  onUnviewedMessage() {
    this.unviewedMessage.emit(true);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
