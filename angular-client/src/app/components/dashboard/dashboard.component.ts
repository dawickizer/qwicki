import { Component } from '@angular/core';
import { Friend } from 'src/app/state/friend/friend.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  panels = [
    { friend: null, color: 'none' },
    { friend: new Friend({ username: 'Senjoku' }), color: 'none' },
    { friend: new Friend({ username: 'MintOwl' }), color: 'none' },
    { friend: null, color: 'none' },
    { friend: null, color: 'none' },
  ];

  start() {
    console.log('start');
  }
}
