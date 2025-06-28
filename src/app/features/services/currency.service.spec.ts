import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency.service';
import { provideHttpClient } from '@angular/common/http';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrencyService,
        provideHttpClient()  
      ]
    });

    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
