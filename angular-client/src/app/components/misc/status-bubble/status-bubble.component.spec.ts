import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBubbleComponent } from './status-bubble.component';

describe('StatusBubbleComponent', () => {
  let component: StatusBubbleComponent;
  let fixture: ComponentFixture<StatusBubbleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusBubbleComponent],
    });
    fixture = TestBed.createComponent(StatusBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
