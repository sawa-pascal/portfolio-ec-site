import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.sharedValueService.getApiUrl()}items/get_items_list.php`);
  }

  //private userId: number = -1;

  addToCart(productId: number, userId: number) {
    const body = {
      user_id: userId, // ログイン中のユーザーIDをセット
      product_id: productId,
      quantity: 1,
    };

    let _api = '/api/portfolio/api/add_to_cart.php';
    this.http.post(_api, body).subscribe({
      next: (res) => alert('カートに追加しました！'),
      error: (err) => alert('エラーが発生しました'),
    });
  }
}
