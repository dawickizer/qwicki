import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsTypingComponent } from './is-typing.component';

describe('IsTypingComponent', () => {
  let component: IsTypingComponent;
  let fixture: ComponentFixture<IsTypingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsTypingComponent],
    });
    fixture = TestBed.createComponent(IsTypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
