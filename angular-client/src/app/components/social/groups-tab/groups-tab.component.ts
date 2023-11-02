import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-groups-tab',
  templateUrl: './groups-tab.component.html',
  styleUrls: ['./groups-tab.component.css'],
})
export class GroupsTabComponent implements OnInit {
  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.isAsyncDataPresent = true;
  }
}
