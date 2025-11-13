import { Component, OnInit } from '@angular/core';
import { SharedValueService } from '../../services/shared-value.service';
import { CurrencyPipe } from '@angular/common';
import { NavigateService } from '../../services/navigate.service';

@Component({
  selector: 'app-purchase-confirmed.component',
  imports: [CurrencyPipe],
  templateUrl: './purchase-confirmed.component.html',
  styleUrl: './purchase-confirmed.component.scss',
})
export class PurchaseConfirmedComponent implements OnInit {
  cartItems: any[] = [];
  CART_SESSION_KEY = 'cart_items';

  constructor(
    private sharedValueService: SharedValueService,
    private navigateService: NavigateService
  ) {}

  ngOnInit() {
    const sessionStr = sessionStorage.getItem(this.CART_SESSION_KEY);
    if (sessionStr) {
      this.cartItems = JSON.parse(sessionStr);
    } else {
      this.cartItems = [];
    }
    // セッションデータを削除する
    sessionStorage.removeItem(this.CART_SESSION_KEY);
  }

  getItemImageUrl(url: string): string {
    return this.sharedValueService.getImageUrl() + url;
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  getTotalWithTax(): number {
    return Math.round(this.getTotal() * 1.1);
  }

  toTopPage() {
    this.navigateService.toTopPage();
  }
}
