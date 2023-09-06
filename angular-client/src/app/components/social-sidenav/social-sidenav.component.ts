import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { UserService } from 'src/app/services/user/user.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Store } from '@ngrx/store';
import { combineLatest, takeUntil, Subject, Observable } from 'rxjs';
import { selectJWT, selectUser } from 'src/app/state/user/user.selectors';
import { createPersonalRoom } from 'src/app/state/social-rooms/social-rooms.actions';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;

  self: User;
  selfJWT: any;
  user$: Observable<User>;

  isAsyncDataPresent = false;
  unsubscribe$ = new Subject<void>();

  constructor(
    private keyBindService: KeyBindService,
    public authService: AuthService,
    public colyseusService: ColyseusService,
    private store: Store
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {

    this.store.dispatch(createPersonalRoom());

    combineLatest([this.store.select(selectUser), this.store.select(selectJWT)])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async ([self, jwt]) => {
        this.self = self;
        this.selfJWT = jwt;
        //await this.colyseusService.establishHost(this.self, this.selfJWT);
        this.isAsyncDataPresent = true;
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
}
