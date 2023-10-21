import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/state/auth/auth.service';
import { User } from 'src/app/state/user/user.model';
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
    private authService: AuthService
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
    this.userService.updateUser(this.user).subscribe();
  }

  delete() {
    this.userService.deleteUser(this.user).subscribe();
    this.authService.logout({ makeBackendCall: false }).subscribe();
  }
}
