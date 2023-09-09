import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Subject, Observable, takeUntil } from 'rxjs';
import { UserStateService } from 'src/app/state/user/user.state.service';
import { SocialRoomsStateService } from 'src/app/state/social-rooms/social-rooms.state.service';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;

  user$: Observable<User>;
  userStateIsLoading$: Observable<boolean>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private keyBindService: KeyBindService,
    public authService: AuthService,
    public colyseusService: ColyseusService,
    private userStateService: UserStateService,
    private socialRoomsStateService: SocialRoomsStateService
  ) {}

  ngOnInit() {
    this.user$ = this.userStateService.user$;
    this.userStateIsLoading$ = this.userStateService.isLoading$;

    this.socialRoomsStateService.socialRoomsState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(state => {
        console.log(state);
      });

    this.userStateService.userState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log(user);
      });

    this.userStateService.userFriends$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(friends => {
        console.log(friends);
      });

    this.socialRoomsStateService.createPersonalRoom();
    this.socialRoomsStateService.joinFriendsRoomsIfPresent();

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
