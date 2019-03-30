import { TestBed } from '@angular/core/testing';

import { LocalStrorageService } from './local-strorage.service';

describe('LocalStrorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalStrorageService = TestBed.get(LocalStrorageService);
    expect(service).toBeTruthy();
  });
});
