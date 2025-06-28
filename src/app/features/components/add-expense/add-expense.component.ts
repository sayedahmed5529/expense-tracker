import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Router } from '@angular/router';
import { Expense } from '../../interfaces/expense';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
form! : FormGroup;
categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other','Shopping', 'Health', 'Travel', 'Gas', 'Education'];
receiptPreview: string | null = null;

isLoading = false;
fileUrl: string | null = null;
constructor(private fb: FormBuilder,
   private expenseService: ExpenseService, private router: Router,
  private currencyService: CurrencyService) {

}
ngOnInit() {
    this.initForm();
}
initForm() {
  this.form = this.fb.group({
  title: ['', Validators.required],
  amount: [0, [Validators.required, Validators.min(1)]],
  currency: ['EGP', Validators.required],
  date: ['', Validators.required],
  category: ['', Validators.required],
  type: ['']
});
}
onFileChange(event: any) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.receiptPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


onSubmit() {
  if (this.form.invalid) return;

  this.isLoading = true;
  const value = this.form.value;

  this.currencyService.convert(value.amount, value.currency, 'USD').subscribe((convertedAmount) => {
    const newExpense: Expense = {
      id: Date.now(),
      ...value,
      convertedAmount,
      convertedCurrency: 'USD',
    };

    this.expenseService.addExpense(newExpense); 
    this.router.navigate(['/dashboard']);
    this.isLoading = false;
  });
}
navigateBack() {
  this.router.navigate(['/dashboard']);
}
}
