import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exists } from 'src/app/utilities/username.utility';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {}

  play() {
    this.router.navigate(['/babylonjs'], { queryParams: { username: exists(this.username) } });
  }
}
