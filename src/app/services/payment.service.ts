import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  requestGetPayments(): Observable<any> {
    return this.http.get<any>(`${this.sharedValueService.getApiUrl()}sales/get_payment.php`);
  }
}
