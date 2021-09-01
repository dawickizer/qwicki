import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  return: string = '';
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.return = params['return'] || '/babylonjs');
  }

  login() {
    this.authService.login(this.credentials).subscribe(
      credentials => this.router.navigate([this.return]), 
      error => this.openSnackBar(error, 'Dismiss')
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
