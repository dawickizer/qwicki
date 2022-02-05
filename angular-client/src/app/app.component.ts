import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Qwicki';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit(): void {
    // logout user on tab close globally
    window.addEventListener("beforeunload", (e) => this.authService.logout());
  }
}
