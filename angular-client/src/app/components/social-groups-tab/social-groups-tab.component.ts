import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-social-groups-tab',
  templateUrl: './social-groups-tab.component.html',
  styleUrls: ['./social-groups-tab.component.css'],
})
export class SocialGroupsTabComponent implements OnInit {
  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.isAsyncDataPresent = true;
  }
}
