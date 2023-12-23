import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyMatchGameMatchMakingComponent } from './money-match-game-match-making.component';

describe('MoneyMatchGameMatchMakingComponent', () => {
  let component: MoneyMatchGameMatchMakingComponent;
  let fixture: ComponentFixture<MoneyMatchGameMatchMakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoneyMatchGameMatchMakingComponent],
    });
    fixture = TestBed.createComponent(MoneyMatchGameMatchMakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
