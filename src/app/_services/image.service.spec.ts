import {TestBed} from '@angular/core/testing';

import {ImageService} from './image.service';

describe('PhotoService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
