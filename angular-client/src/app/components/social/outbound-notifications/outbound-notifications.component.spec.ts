import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundNotificationsComponent } from './outbound-notifications.component';

describe('OutboundNotificationsComponent', () => {
  let component: OutboundNotificationsComponent;
  let fixture: ComponentFixture<OutboundNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutboundNotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
