import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
import { establishHost, roomCreated } from './social-rooms.actions';

@Injectable()
export class SocialRoomEffects {
  //   establishHost$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(establishHost),
  //       mergeMap(action => this.colyseusService.establishHost(action.hostJWT)
  //         .pipe(
  //           map(room => roomCreated({ room })),
  //           catchError(error => of(/* Handle error, maybe dispatch a failure action */))
  //         )
  //       )
  //     )
  //   );

  // Define more effects for other actions

  constructor(
    private actions$: Actions,
    private colyseusService: ColyseusService
  ) {}
}
