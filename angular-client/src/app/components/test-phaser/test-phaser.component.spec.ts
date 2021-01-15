import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestPhaserComponent } from './test-phaser.component';

describe('TestPhaserComponent', () => {
  let component: TestPhaserComponent;
  let fixture: ComponentFixture<TestPhaserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPhaserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPhaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
