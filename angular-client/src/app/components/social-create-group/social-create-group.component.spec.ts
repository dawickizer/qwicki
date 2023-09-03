import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCreateGroupComponent } from './social-create-group.component';

describe('SocialCreateGroupComponent', () => {
  let component: SocialCreateGroupComponent;
  let fixture: ComponentFixture<SocialCreateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialCreateGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialCreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
