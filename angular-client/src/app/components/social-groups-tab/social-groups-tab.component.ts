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

  titleColor = 'color:aliceblue';

  group: { name: string } = { name: '' };

  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.isAsyncDataPresent = true;
  }

  createGroup() {}

  disableGroupCreation() {
    return false;
  }
}
