// import { Component, OnInit } from '@angular/core';
// import { User } from "src/app/state/user/user.model";
// import { of, Observable } from 'rxjs';
// import { Group } from 'src/app/models/group/group';
// import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';

// @Component({
//   selector: 'app-social-create-group',
//   templateUrl: './social-create-group.component.html',
//   styleUrls: ['./social-create-group.component.css'],
// })
// export class SocialCreateGroupComponent implements OnInit {
//   titleColor = 'color:aliceblue';

//   group: Group = new Group();

//   friends$: Observable<User[]> = new Observable<User[]>();

//   selectedFriends: User[] = [];

//   isAsyncDataPresent = false;

//   constructor(private colyseusService: ColyseusService) {}

//   ngOnInit(): void {
//     this.friends$ = of(this.colyseusService.host.friends);
//     this.isAsyncDataPresent = true;
//   }

//   createGroup() {
//     console.log(this.group.name);
//     console.log(this.selectedFriends);
//     this.group.name = '';
//     this.selectedFriends = [];
//   }

//   disableGroupCreation() {
//     return this.selectedFriends.length == 0 || !this.group.name;
//   }
// }
