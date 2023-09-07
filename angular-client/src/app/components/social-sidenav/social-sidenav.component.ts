import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { Subject, Observable } from 'rxjs';
import { UserStateService } from 'src/app/state/user/user.state.service';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;

  user$: Observable<User>;
  isLoading$: Observable<boolean>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private keyBindService: KeyBindService,
    public authService: AuthService,
    public colyseusService: ColyseusService,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    this.user$ = this.userStateService.user$;
    this.isLoading$ = this.userStateService.isLoading$;

    // this.store.dispatch(createPersonalRoom());

    // combineLatest([this.store.select(selectUser), this.store.select(selectJWT)])
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(async ([self, jwt]) => {
    //     this.self = self;
    //     this.selfJWT = jwt;
    //     //await this.colyseusService.establishHost(this.self, this.selfJWT);
    //   });

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
