import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchMakingSidenavComponent } from './match-making-sidenav.component';

describe('MatchMakingSidenavComponent', () => {
  let component: MatchMakingSidenavComponent;
  let fixture: ComponentFixture<MatchMakingSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchMakingSidenavComponent],
    });
    fixture = TestBed.createComponent(MatchMakingSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
