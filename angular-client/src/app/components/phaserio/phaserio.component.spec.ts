import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhaserioComponent } from './phaserio.component';

describe('PhaserioComponent', () => {
  let component: PhaserioComponent;
  let fixture: ComponentFixture<PhaserioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaserioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaserioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
