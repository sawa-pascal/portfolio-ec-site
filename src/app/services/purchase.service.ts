import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  requestPurchase(
    user_id: number,
    payment_id: number,
    item_ids: number[],
    quantities: number[]
  ): Observable<any> {
    const body = {
      user_id,
      payment_id,
      item_ids,
      quantities,
    };
    return this.http.post<any>(`${this.sharedValueService.getApiUrl()}sales/purchase.php`, body);
  }
}
