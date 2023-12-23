import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGameMatchMakingComponent } from './custom-game-match-making.component';

describe('CustomGameMatchMakingComponent', () => {
  let component: CustomGameMatchMakingComponent;
  let fixture: ComponentFixture<CustomGameMatchMakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomGameMatchMakingComponent],
    });
    fixture = TestBed.createComponent(CustomGameMatchMakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
