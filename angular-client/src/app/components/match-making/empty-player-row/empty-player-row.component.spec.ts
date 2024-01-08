import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyPlayerRowComponent } from './empty-player-row.component';

describe('EmptyPlayerRowComponent', () => {
  let component: EmptyPlayerRowComponent;
  let fixture: ComponentFixture<EmptyPlayerRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyPlayerRowComponent],
    });
    fixture = TestBed.createComponent(EmptyPlayerRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
