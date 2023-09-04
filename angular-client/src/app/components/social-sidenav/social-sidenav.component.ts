import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { UserService } from 'src/app/services/user/user.service';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';

@Component({
  selector: 'app-social-sidenav',
  templateUrl: './social-sidenav.component.html',
  styleUrls: ['./social-sidenav.component.css'],
})
export class SocialSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;

  self: User;
  selfJWT: any;
  isAsyncDataPresent = false;

  constructor(
    private keyBindService: KeyBindService,
    public authService: AuthService,
    public colyseusService: ColyseusService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.currentUser().subscribe(self =>
      this.userService.get(self._id).subscribe(async self => {
        this.setSelf(self);
        await this.colyseusService.establishHost(this.self, this.selfJWT);
        this.isAsyncDataPresent = true;
      })
    );
    this.handleSideNavKeyBind();
  }

  setSelf(self: User) {
    this.self = self;
    this.selfJWT = this.authService.currentUserJWT();
  }

  ngOnDestroy() {
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
