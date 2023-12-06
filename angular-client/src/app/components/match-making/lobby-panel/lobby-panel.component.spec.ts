import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyPanelComponent } from './lobby-panel.component';

describe('LobbyPanelComponent', () => {
  let component: LobbyPanelComponent;
  let fixture: ComponentFixture<LobbyPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LobbyPanelComponent],
    });
    fixture = TestBed.createComponent(LobbyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
