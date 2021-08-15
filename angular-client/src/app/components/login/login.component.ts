import { Component, OnInit } from '@angular/core';
import { AuthCredentials } from 'src/app/models/auth-credentials/auth-credentials';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authCredentials: AuthCredentials = new AuthCredentials();
  constructor(private authService: AuthService) { }

  ngOnInit(): void {}

  login() {
    console.log(this.authCredentials.username);
    console.log(this.authCredentials.password);
    this.authService.login(this.authCredentials).subscribe((authCredentials: AuthCredentials) => {
      console.log(authCredentials);
    });
  }

}
