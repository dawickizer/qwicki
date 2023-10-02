import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthStateService } from 'src/app/state/auth/auth.state.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private authStateService: AuthStateService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authStateService.isLoggedIn$;
  }

  logout() {
    this.authStateService.logout();
  }
}
