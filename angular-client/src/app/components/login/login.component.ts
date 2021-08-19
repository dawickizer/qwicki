import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Credentials } from 'src/app/models/credentials/credentials';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials: Credentials = new Credentials();
  constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {}

  login() {
    this.authService.login(this.credentials).subscribe((credentials: Credentials) => {
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
