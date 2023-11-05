import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatCellComponent } from './chat-cell.component';

describe('ChatCellComponent', () => {
  let component: ChatCellComponent;
  let fixture: ComponentFixture<ChatCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
