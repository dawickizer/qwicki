import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';
import { UserService } from 'src/app/state/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User = new User();
  unsubscribe$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit(): void {
    this.userService.user$
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
    this.userService
      .updateUser(this.user)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  delete() {
    this.userService
      .deleteUser(this.user)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
    this.authStateService.logout({ makeBackendCall: false });
  }
}
