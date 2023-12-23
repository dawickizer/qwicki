import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankedGameMatchMakingComponent } from './ranked-game-match-making.component';

describe('RankedGameMatchMakingComponent', () => {
  let component: RankedGameMatchMakingComponent;
  let fixture: ComponentFixture<RankedGameMatchMakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankedGameMatchMakingComponent],
    });
    fixture = TestBed.createComponent(RankedGameMatchMakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
