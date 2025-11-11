import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user-model';
import { PurchaseService } from '../../services/purchase.service';
import { PaymentService } from '../../services/payment.service';
import { SharedValueService } from '../../services/shared-value.service';

@Component({
  selector: 'app-purchase-confirm.component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './purchase-confirm.component.html',
  styleUrl: './purchase-confirm.component.scss',
})
export class PurchaseConfirmComponent implements OnInit {
  user: User | null = null;
  cartItems: any[] = [];
  paymentForm: FormGroup;
  paymentMethods: any[] = [];
  message: string = '';
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private purchaseService: PurchaseService,
    private paymentService: PaymentService,
    private sharedValueService: SharedValueService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
    });

    this.user = this.userService.getUser();

    // カートデータをセッションストレージから取得
    const cartJson = sessionStorage.getItem('cart_items');
    if (cartJson) {
      try {
        const cartData = JSON.parse(cartJson);
        if (Array.isArray(cartData)) {
          this.cartItems = cartData;
        } else {
          this.cartItems = [];
        }
      } catch {
        this.cartItems = [];
      }
    } else {
      this.cartItems = [];
    }
  }

  ngOnInit() {
    // paymentテーブルから支払い方法リストを取得
    this.paymentService.requestGetPayments().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.payments)) {
          this.paymentMethods = res.payments.map((p: any) => ({
            id: p.id,
            name: p.name,
          }));
        } else {
          this.paymentMethods = [];
        }
      },
      error: (err: any) => {
        this.paymentMethods = [];
      },
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  getTotalWithTax(): number {
    return Math.round(this.getTotal() * 1.1);
  }

  onPurchase() {
    if (this.paymentForm.invalid || !this.user) {
      return;
    }

    const payment_id = Number(this.paymentForm.value.paymentMethod);

    if (!payment_id) {
      this.message = '支払い方法を選択してください。';
      return;
    }
    if (!this.cartItems || this.cartItems.length === 0) {
      this.message = 'カートが空です。';
      return;
    }

    const item_ids: number[] = this.cartItems.map((item) => item.id);
    const quantities: number[] = this.cartItems.map((item) => Number(item.quantity));
    const user_id = this.user.id;

    this.loading = true;
    this.message = '';

    this.purchaseService.requestPurchase(user_id, payment_id, item_ids, quantities).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          console.log(res.message + res.sale_id);
          this.router
            .navigate(['/purchase-confirmed'])
            .then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        } else {
          this.message = res.message || '購入に失敗しました。';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err?.error?.message || '購入処理中にエラーが発生しました。';
      },
    });
  }

  onCancel() {
    this.router.navigate(['/cart']);
  }

  getItemImageUrl(imageUrl: string): string {
    return this.sharedValueService.getImageUrl() + imageUrl;
  }
}
