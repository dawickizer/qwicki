import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyLobbyComponent } from './party-lobby.component';

describe('PartyLobbyComponent', () => {
  let component: PartyLobbyComponent;
  let fixture: ComponentFixture<PartyLobbyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyLobbyComponent],
    });
    fixture = TestBed.createComponent(PartyLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
