import { TestBed } from '@angular/core/testing';

import { EnumService } from './enum.service';

describe('EnumServiceService', () => {
  let service: EnumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
