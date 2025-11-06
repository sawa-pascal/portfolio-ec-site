import { TestBed } from '@angular/core/testing';

import { SharedValueService } from './shared-value.service';

describe('SharedValueService', () => {
  let service: SharedValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
