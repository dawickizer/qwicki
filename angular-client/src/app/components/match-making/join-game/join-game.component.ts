import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatchMakingService } from 'src/app/services/match-making/match-making.service';
import * as Colyseus from 'colyseus.js';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css'],
})
export class JoinGameComponent implements OnInit {
  public availableGameRoomsDisplayedColumns: string[] = [
    'name',
    'mode',
    'map',
    'createdBy',
    'createdAt',
    'action',
  ];
  public availableGameRooms = new MatTableDataSource<Colyseus.RoomAvailable>(
    [] as Colyseus.RoomAvailable[]
  );

  constructor(
    private router: Router,
    public matchMakingService: MatchMakingService
  ) {}

  async ngOnInit() {
    this.getAvailableGameRooms();
  }

  async getAvailableGameRooms() {
    this.availableGameRooms.data =
      await this.matchMakingService.getAvailableGameRooms();

    this.availableGameRooms.data = [
      {
        metadata: {
          name: 'Space Adventure',
          mode: 'Survival',
          map: 'Galaxy',
          createdBy: { username: 'User1' },
          createdAt: new Date(2022, 6, 24, 15, 30), // Date format: year, monthIndex, day, hours, minutes
        },
      },
      {
        metadata: {
          name: 'Jungle Escape',
          mode: 'Exploration',
          map: 'Forest',
          createdBy: { username: 'User2' },
          createdAt: new Date(2022, 6, 25, 10, 45),
        },
      },
      {
        metadata: {
          name: 'Desert Rally',
          mode: 'Race',
          map: 'Sahara',
          createdBy: { username: 'User3' },
          createdAt: new Date(2022, 6, 26, 20, 20),
        },
      },
    ] as any;
  }

  async joinGameRoom(game: Colyseus.RoomAvailable) {
    this.matchMakingService.gameRoomId = game.roomId;
    this.router.navigate(['/game'], { queryParams: { connection: 'join' } });
  }

  gameRoomsPresent(): boolean {
    return (
      this.availableGameRooms.data && this.availableGameRooms.data.length > 0
    );
  }

  filter(filterValue: any) {
    this.availableGameRooms.filterPredicate = (
      game: Colyseus.RoomAvailable,
      filter: string
    ) => this.filterPredicate(game, filter);
    this.availableGameRooms.filter = filterValue.target.value
      .trim()
      .toLowerCase();
  }

  filterPredicate(game: Colyseus.RoomAvailable, filter: string) {
    const createdAt: Date = new Date(game.metadata.createdAt);
    const timestamp: string =
      createdAt.toDateString() + ', ' + createdAt.toLocaleTimeString();
    return (
      game.metadata.name.trim().toLowerCase().includes(filter) ||
      game.metadata.mode.trim().toLowerCase().includes(filter) ||
      game.metadata.map.trim().toLowerCase().includes(filter) ||
      game.metadata.createdBy.username.trim().toLowerCase().includes(filter) ||
      timestamp.trim().toLowerCase().includes(filter)
    );
  }
}
