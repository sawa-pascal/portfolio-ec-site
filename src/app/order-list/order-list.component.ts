import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';
import { UserService } from '../services/user.service';
import { CurrencyPipe } from '@angular/common';
import { SharedValueService } from '../services/shared-value.service';

@Component({
  selector: 'app-order-list',
  imports: [CurrencyPipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  purchaseHistory: any[] = [];

  constructor(
    private purchaseService: PurchaseService,
    private userService: UserService,
    private sharedValueService: SharedValueService
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();
    console.log(user);
    if (user && user.id) {
      this.purchaseService.requestGetPurchaseHistory(Number(user.id)).subscribe((res) => {
        if (res.success) {
          console.log('tester');
          if (res.purchase_history) {
            console.log(res.purchase_history);
            this.purchaseHistory = res.purchase_history;
          }
        } else {
          console.log(res.message);
        }
      });

      console.log(this.purchaseHistory);
    }
  }

  getImageUrl(history: any): string {
    return this.sharedValueService.getImageUrl() + history.item_image_url;
  }

  calcTotal(data: any): number {
    let total = 0;

    if (Array.isArray(data)) {
      total = data.reduce((sum: number, item: any) => {
        // Assumes each item has price and quantity
        return sum + (item.price * item.quantity);
      }, 0);
    }

    return total;
  }

  calcTotalWithTax(data: any): number {
    const taxRate = 0.1; // 10% tax

    const totalWithTax = Math.round(this.calcTotal(data) * (1 + taxRate));

    return totalWithTax;
  }
}
