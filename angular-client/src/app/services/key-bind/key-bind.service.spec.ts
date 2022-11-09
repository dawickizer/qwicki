import { TestBed } from '@angular/core/testing';

import { KeyBindService } from './key-bind.service';

describe('KeyBindService', () => {
  let service: KeyBindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyBindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
