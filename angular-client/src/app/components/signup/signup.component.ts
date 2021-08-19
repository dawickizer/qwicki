import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Credentials } from 'src/app/models/credentials/credentials';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  credentials: Credentials = new Credentials();
  user: User = new User();

  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {}

  signup() {
    this.authService.signup(this.user).subscribe((credentials: Credentials) => {
      console.log(credentials);
      this.openSnackBar('Successful login', 'Dismiss');
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
