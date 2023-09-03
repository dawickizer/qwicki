import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilterableMultiSelectComponent } from './user-filterable-multi-select.component';

describe('UserFilterableMultiSelectComponent', () => {
  let component: UserFilterableMultiSelectComponent;
  let fixture: ComponentFixture<UserFilterableMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserFilterableMultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFilterableMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
