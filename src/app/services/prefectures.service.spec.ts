import { TestBed } from '@angular/core/testing';

import { PrefecturesService } from './prefectures.service';

describe('PrefecturesService', () => {
  let service: PrefecturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefecturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
