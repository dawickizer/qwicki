import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestBabylonComponent } from './test-babylon.component';

describe('TestBabylonComponent', () => {
  let component: TestBabylonComponent;
  let fixture: ComponentFixture<TestBabylonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestBabylonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBabylonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
