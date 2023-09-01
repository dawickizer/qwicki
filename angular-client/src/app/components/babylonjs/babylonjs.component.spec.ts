import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BabylonjsComponent } from './babylonjs.component';

describe('BabylonjsComponent', () => {
  let component: BabylonjsComponent;
  let fixture: ComponentFixture<BabylonjsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BabylonjsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabylonjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
