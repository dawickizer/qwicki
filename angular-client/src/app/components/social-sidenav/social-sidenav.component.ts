import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { Subject, Observable, takeUntil } from 'rxjs';
import { UserService } from 'src/app/state/user/user.service';
import { User } from 'src/app/state/user/user.model';
import { SocialOrchestratorService } from 'src/app/state/orchestrator/social.orchestrator.service';
import { MessageService } from 'src/app/state/message/message.service';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;
  activeTabIndex = 0;
  unviewedMessagesCount: number;
  user$: Observable<User>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private keyBindService: KeyBindService,
    private userService: UserService,
    private socialOrchestratorService: SocialOrchestratorService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.socialOrchestratorService.createPersonalInbox().subscribe();
    this.socialOrchestratorService.joinFriendsInboxesIfPresent().subscribe();
    this.messageService.unviewedMessages$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(unviewedMessages => {
        if (unviewedMessages) {
          this.unviewedMessagesCount = unviewedMessages.length;
        }
      });
    this.handleSideNavKeyBind();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.keyBindService.removeKeyBinds();
  }

  handleSideNavKeyBind() {
    this.keyBindService.setKeyBind('keydown', event => {
      if (event.code == 'Tab') {
        event.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen();
        this.drawer.toggle();
      }
    });
  }

  onTabChanged(index: number): void {
    this.activeTabIndex = index;
  }
}
