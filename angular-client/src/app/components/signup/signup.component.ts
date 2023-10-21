import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthOrchestratorService } from 'src/app/state/orchestrator/auth.orchestrator.service';
import { User } from 'src/app/state/user/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnDestroy {
  user: User = new User();
  unsubscribe$ = new Subject<void>();

  constructor(private authOrchestratorService: AuthOrchestratorService) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  signup() {
    this.authOrchestratorService.signup(new User(this.user), '/').subscribe();
  }
}
