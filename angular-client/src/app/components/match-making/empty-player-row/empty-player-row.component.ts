import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/state/game/game.service';
import { Team } from 'src/app/state/game/team.model';
import { Invite } from 'src/app/state/invite/invite.model';

@Component({
  selector: 'app-empty-player-row',
  templateUrl: './empty-player-row.component.html',
  styleUrls: ['./empty-player-row.component.css'],
})
export class EmptyPlayerRowComponent implements OnInit, OnDestroy {
  @Input() team: Team;
  private gameId: string;
  invite: Invite;

  private subscription: Subscription = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.subscribeToState();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private subscribeToState() {
    this.subscription.add(
      this.gameService.id$.subscribe(id => {
        this.gameId = id;
        this.invite = new Invite({
          type: 'game',
          roomId: this.gameId,
          channelId: this.team._id,
        });
      })
    );
  }
}
