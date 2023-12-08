import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyChatBoxComponent } from './lobby-chat-box.component';

describe('LobbyChatBoxComponent', () => {
  let component: LobbyChatBoxComponent;
  let fixture: ComponentFixture<LobbyChatBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LobbyChatBoxComponent],
    });
    fixture = TestBed.createComponent(LobbyChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
