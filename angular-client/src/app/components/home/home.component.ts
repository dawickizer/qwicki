import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { KeyBindService } from 'src/app/services/key-bind/key-bind.service';
import { UserService } from 'src/app/services/user/user.service';

export interface Friend {
  name: string;
}

const FRIENDS: Friend[] = [
  {name: 'Arshmazing'},
  {name: 'Senjoku'},
  {name: 'LiemWin'},
  {name: 'cpt_crispy'}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'delete', 'send'];
  dataSource = new MatTableDataSource<Friend>([] as Friend[]);
  user: User = new User();
  @ViewChild('drawer') drawer: MatSidenav;

  searchValue: string = '';

  constructor(
    private router: Router, 
    private keyBindService: KeyBindService,
    private authService: AuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.handleSideNavKeyBind();
    this.dataSource.data = FRIENDS;
    this.authService.currentUser().subscribe(user => this.userService.get(user._id).subscribe(user => this.user = user));
  }

  ngOnDestroy() {
    this.keyBindService.removeKeyBinds();
  }

  search() {
    console.log('Search');
  }

  send() {
    console.log('send')
  }

  filter(filterValue: any) {
    this.dataSource.filterPredicate = (friend, filter) => friend.name.trim().toLowerCase().includes(filter);
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
  }

  handleSideNavKeyBind() {
    this.keyBindService.setKeyBind('keydown', event => { 
      if (event.code == 'Tab') {
        event.preventDefault();
        if (document.fullscreenElement) document.exitFullscreen();
        this.drawer.toggle();
      }
    });  
  }
}
