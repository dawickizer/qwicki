import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User = new User();

  constructor(private userService: UserService, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.currentUser().subscribe(user => this.userService.get(user._id).subscribe(user => this.user = new User(user)));
  }

  update() {
    this.userService.update(this.user).subscribe({
      next: user => {
        this.user = new User(user);
        this.openSnackBar('Your information has been successfully updated!', 'Dismiss')
      }, 
      error: error => this.openSnackBar(error, 'Dismiss')
    });
  }

  delete() {
    this.userService.delete(this.user).subscribe(
      res => {
        this.authService.logout();
        this.openSnackBar('Your account has been successfully deleted!', 'Dismiss');
      }, 
      error => this.openSnackBar(error, 'Dismiss')
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

}
