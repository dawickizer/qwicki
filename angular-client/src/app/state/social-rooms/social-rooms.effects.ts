// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { of, withLatestFrom, from } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';
// import { ColyseusService } from 'src/app/services/colyseus/colyseus.service';
// import { createPersonalRoom, createPersonalRoomFailure, createPersonalRoomSuccess } from './social-rooms.actions';
// import { Store } from '@ngrx/store';
// import { selectJWT, selectUser } from '../user/user.selectors';

// @Injectable()
// export class SocialRoomEffects {

// // social-rooms.effects.ts
// createPersonalRoom$ = createEffect(() =>
//   this.actions$.pipe(
//     ofType(createPersonalRoom),
//     withLatestFrom(
//       this.store.select(selectUser),
//       this.store.select(selectJWT)
//     ),
//     mergeMap(([_, user, JWT]) =>
//       from(this.colyseusService.createRoomXXX(user._id, JWT)).pipe(
//         map(room => {

//           console.log(JWT);
//           console.log(user)
//           console.log(room)
//           if(room) {
//             return createPersonalRoomSuccess({ room });
//           } else {
//             throw new Error('Failed to create personal room');
//           }
//         }),
//         catchError(error => of(createPersonalRoomFailure({ error })))
//       )
//     )
//   )
// );

//   constructor(
//     private actions$: Actions,
//     private store: Store,
//     private colyseusService: ColyseusService
//   ) {}
// }
