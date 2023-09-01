import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialSidenavComponent } from './social-sidenav.component';

describe('SocialSidenavComponent', () => {
  let component: SocialSidenavComponent;
  let fixture: ComponentFixture<SocialSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialSidenavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
