import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  LucideAngularModule, Plus, Wallet } from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'expense-tracker';
    Wallet = Wallet;
  Plus = Plus;
}
