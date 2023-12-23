import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalGameMatchMakingComponent } from './normal-game-match-making.component';

describe('NormalGameMatchMakingComponent', () => {
  let component: NormalGameMatchMakingComponent;
  let fixture: ComponentFixture<NormalGameMatchMakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalGameMatchMakingComponent],
    });
    fixture = TestBed.createComponent(NormalGameMatchMakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
