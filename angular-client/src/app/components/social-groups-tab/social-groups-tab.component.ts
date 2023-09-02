import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-social-groups-tab',
  templateUrl: './social-groups-tab.component.html',
  styleUrls: ['./social-groups-tab.component.css'],
})
export class SocialGroupsTabComponent implements OnInit {
  @Input() self: User;
  @Input() selfJWT: any;

  titleColor: string = "color:rgb(0, 162, 255)";

  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.isAsyncDataPresent = true;
  }
}
