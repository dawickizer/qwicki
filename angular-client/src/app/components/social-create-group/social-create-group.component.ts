import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user/user';
import { of, Observable } from 'rxjs';
import { Group } from 'src/app/models/group/group';

@Component({
  selector: 'app-social-create-group',
  templateUrl: './social-create-group.component.html',
  styleUrls: ['./social-create-group.component.css'],
})
export class SocialCreateGroupComponent implements OnInit {
  @Input() self: User;
  @Input() selfJWT: any;

  titleColor = 'color:aliceblue';

  group: Group = new Group();

  friends$: Observable<User[]> = new Observable<User[]>();

  selectedFriends: User[] = [];

  isAsyncDataPresent = false;

  ngOnInit(): void {
    this.friends$ = of(this.self.friends);
    this.isAsyncDataPresent = true;
  }

  createGroup() {
    console.log(this.group.name);
    console.log(this.selectedFriends);
    this.group.name = '';
    this.selectedFriends = [];
  }

  disableGroupCreation() {
    return this.selectedFriends.length == 0 || !this.group.name;
  }
}
