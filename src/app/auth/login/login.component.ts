import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form!: FormGroup
  isLoading = false;
  ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: FormBuilder,
    private authserv: AuthService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get controls() {
    return this.form.controls;
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;


    this.authserv.login(this.form.value).pipe(takeUntil(this.ngUnsubscribe),
     finalize(
      () => {
        this.isLoading = false;
      }
    )).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
