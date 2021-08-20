import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Credentials } from 'src/app/models/credentials/credentials';
import { AuthService } from 'src/app/services/auth/auth.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials: Credentials = new Credentials();
  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {}

  login() {
    this.authService.login(this.credentials).subscribe((credentials: Credentials) => {
      let decoded: any = jwt_decode(credentials.token as string);
      this.router.navigate(['/babylonjs'], { queryParams: { username: decoded.usernameRaw } });
    }, error => this.openSnackBar(error, 'Dismiss'));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
