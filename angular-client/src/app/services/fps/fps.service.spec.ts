import { TestBed } from '@angular/core/testing';

import { FpsService } from './fps.service';

describe('FpsService', () => {
  let service: FpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
