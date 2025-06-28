import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddExpenseComponent } from './add-expense.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CurrencyService } from '../../services/currency.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddExpenseComponent', () => {
  let component: AddExpenseComponent;
  let fixture: ComponentFixture<AddExpenseComponent>;
  let expenseServiceSpy: jasmine.SpyObj<ExpenseService>;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    expenseServiceSpy = jasmine.createSpyObj('ExpenseService', ['addExpense']);
    currencyServiceSpy = jasmine.createSpyObj('CurrencyService', ['convert']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AddExpenseComponent, // standalone component
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ExpenseService, useValue: expenseServiceSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.form;
    expect(form.value.title).toBe('');
    expect(form.value.amount).toBe(0); // assuming default value is 0
    expect(form.value.currency).toBe('EGP');
    expect(form.value.type).toBe('');
    expect(form.value.date).toBeDefined();
  });

  it('should mark form invalid if required fields are missing', () => {
    component.form.setValue({
      title: '',
      amount: '',
      currency: '',
      type: '',
      date: '',
      category: ''
    });

    expect(component.form.valid).toBeFalse();
  });

  it('should call addExpense and navigate on successful submit', fakeAsync(() => {
    const currentDate = new Date().toISOString();

    component.form.setValue({
      title: 'Lunch',
      amount: 200,
      currency: 'EGP',
      type: 'income',
      date: currentDate,
      category: 'Food'
    });

    currencyServiceSpy.convert.and.returnValue(of(200));
    expenseServiceSpy.addExpense.and.returnValue(of({
      id: 1,
      title: 'Lunch',
      amount: 200,
      date: currentDate,
      currency: 'EGP',
      type: 'income',
      category: 'Food'
    }));

    component.onSubmit();
    tick();

    expect(currencyServiceSpy.convert).toHaveBeenCalledWith(200, 'EGP', jasmine.any(String));
    expect(expenseServiceSpy.addExpense).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Lunch',
      amount: 200,
      currency: 'EGP',
      type: 'income',
          category: 'Food',
      date: currentDate,
      convertedAmount: 200
    }));

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));
});
