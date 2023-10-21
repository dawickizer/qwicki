import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { Subject, Observable } from 'rxjs';
import { UserService } from 'src/app/state/user/user.service';
import { User } from 'src/app/state/user/user.model';
import { InboxService } from 'src/app/state/inbox/inbox.service';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;

  user$: Observable<User>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private keyBindService: KeyBindService,
    private userService: UserService,
    private inboxService: InboxService
  ) {}

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.inboxService.createPersonalInbox().subscribe();
    this.inboxService.joinFriendsInboxesIfPresent().subscribe();
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
}
