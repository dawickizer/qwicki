import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialChatBoxComponent } from './social-chat-box.component';

describe('SocialChatBoxComponent', () => {
  let component: SocialChatBoxComponent;
  let fixture: ComponentFixture<SocialChatBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialChatBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
