import { TestBed } from '@angular/core/testing';
import { ExpenseService } from './expense.service';
import { provideHttpClient } from '@angular/common/http';

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        ExpenseService
      ]
    });
    service = TestBed.inject(ExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have addExpense function', () => {
    expect(typeof service.addExpense).toBe('function');
  });
});
