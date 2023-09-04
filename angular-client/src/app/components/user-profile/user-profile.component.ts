import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectUser, selectUserError } from 'src/app/state/user/user.selectors';
import { deleteUser, updateUser } from 'src/app/state/user/user.actions';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User = new User();
  unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectUser)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user) {
          this.user = new User(user);
        }
      });

    this.store
      .select(selectUserError)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(error => {
        if (error) {
          //handle error
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  update() {
    this.store.dispatch(updateUser({ user: new User(this.user) }));
  }

  delete() {
    this.store.dispatch(deleteUser({ user: new User(this.user) }));
  }
}
