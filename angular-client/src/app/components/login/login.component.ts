import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login/login';
import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginCredentials: Login = new Login();
  constructor(private loginService: LoginService) { }

  ngOnInit(): void {}

  login() {
    console.log(this.loginCredentials.username);
    console.log(this.loginCredentials.password);
    this.loginService.login(this.loginCredentials).subscribe((loginCredentials: Login) => {
      console.log(loginCredentials);
    });
  }

}
