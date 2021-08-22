import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isLoggedInFrontendCheck();
  }

  authenticateJWT() {
    this.authService.authenticateJWT().subscribe(res => console.log(res));
  }

}
