import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGameSettingsComponent } from './custom-game-settings.component';

describe('CustomGameSettingsComponent', () => {
  let component: CustomGameSettingsComponent;
  let fixture: ComponentFixture<CustomGameSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomGameSettingsComponent],
    });
    fixture = TestBed.createComponent(CustomGameSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
