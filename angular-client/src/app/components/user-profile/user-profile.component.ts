import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserStateService } from 'src/app/state/user/user.state.service';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User = new User();
  unsubscribe$ = new Subject<void>();

  constructor(
    private userStateService: UserStateService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.userStateService.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.user = new User(user);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  update() {
    this.userStateService.updateUser(this.user);
  }

  delete() {
    this.userStateService.deleteUser(this.user);
    this.authStateService.logout({ makeBackendCall: false });
  }
}
