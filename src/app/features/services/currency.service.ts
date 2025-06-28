import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://open.er-api.com/v6/latest/';
  private cache: { [base: string]: any } = {};

  constructor(private http: HttpClient) {}

  getRates(baseCurrency: string = 'USD') {
    if (this.cache[baseCurrency]) {
      return of(this.cache[baseCurrency]);
    }

    return this.http.get<any>(`${this.apiUrl}${baseCurrency}`).pipe(
      map((res) => {
        this.cache[baseCurrency] = res;
        return res;
      }),
      catchError((err) => {
        console.error('Failed to fetch currency rates:', err);
        return of(null);
      })
    );
  }

  convert(amount: number, from: string, to: string) {
    if (from === to) return of(amount);

    return this.getRates(from).pipe(
      map((res) => {
        const rate = res?.rates?.[to];
        return rate ? amount * rate : amount;
      })
    );
  }
}
