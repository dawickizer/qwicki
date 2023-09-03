import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialGroupsListComponent } from './social-groups-list.component';

describe('SocialGroupsListComponent', () => {
  let component: SocialGroupsListComponent;
  let fixture: ComponentFixture<SocialGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialGroupsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
