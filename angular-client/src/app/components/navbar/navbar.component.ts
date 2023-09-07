import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStateService } from 'src/app/state/user/user.state.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private userStateService: UserStateService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.userStateService.isLoggedIn$;
  }

  logout() {
    this.userStateService.logout();
  }
}
