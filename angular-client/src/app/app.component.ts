import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Qwicki';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // this will call on any browser close...prob need to use
  // broadcast channels to handle if multiple browser tabs
  // are open from the same user..only logout when ALL tabs are closed
  // also this logs user out on browser refresh
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.authService.logout();
  }
}
