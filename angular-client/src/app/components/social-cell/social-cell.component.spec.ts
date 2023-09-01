import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCellComponent } from './social-cell.component';

describe('SocialCellComponent', () => {
  let component: SocialCellComponent;
  let fixture: ComponentFixture<SocialCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
