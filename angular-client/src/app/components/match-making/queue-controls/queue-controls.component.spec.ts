import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueControlsComponent } from './queue-controls.component';

describe('QueueControlsComponent', () => {
  let component: QueueControlsComponent;
  let fixture: ComponentFixture<QueueControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueueControlsComponent],
    });
    fixture = TestBed.createComponent(QueueControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
