import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SharedValueService } from '../services/shared-value.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  items: any[] = [];
  quantityMap: { [itemId: number]: FormControl } = {};
  quantityOptions: number[] = [];
  total = 0;

  // セッションストレージのキー
  CART_SESSION_KEY = 'cart_items';

  constructor(
    private userService: UserService,
    private router: Router,
    private sharedValueService: SharedValueService
  ) {}

  ngOnInit() {
    // セッションからカート情報を取得
    this.loadCartFromSession();

    this.quantityOptions = Array.from({ length: this.getQuantityMax() - this.getQuantityMin() + 1 }, (_, i) => i + this.getQuantityMin());

    // quantityMapの初期化
    this.items.forEach((item) => {
      this.quantityMap[item.cart_item_id] = new FormControl(Number(item.quantity));

      // valueChangesの購読（数量が変更されたとき、セッションに反映し、バリデーションも行う）
      this.quantityMap[item.cart_item_id].valueChanges.subscribe((value: number) => {
        if (value == null) {
          return;
        }
        const min = this.getQuantityMin();
        const max = this.getQuantityMax();

        if (value < min) {
          this.quantityMap[item.cart_item_id].setValue(min, { emitEvent: false });
          return;
        }
        if (value > max) {
          this.quantityMap[item.cart_item_id].setValue(max, { emitEvent: false });
          return;
        }

        // セッションに反映
        let id = this.items.findIndex((i) => i.cart_item_id === item.cart_item_id);
        if (id >= 0) {
          this.items[id].quantity = value;
          this.items[id].subtotal = this.items[id].price * value;
          this.saveCartToSession();
          this.updateTotal();
        }
      });
    });

    this.updateTotal();
  }

  getImageUrl(item: any): string {
    return this.sharedValueService.getImageUrl() + item.image_url;
  }

  // セッションストレージからカートを取得してthis.itemsをセット
  loadCartFromSession() {
    const sessionStr = sessionStorage.getItem(this.CART_SESSION_KEY);
    if (sessionStr) {
      const items = JSON.parse(sessionStr);
      // アイテムにはimageUrl・subtotalを付与しておく
      this.items = items.map((item: any) => ({
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal: Number(item.price) * Number(item.quantity),
        imageUrl: this.getImageUrl(item),
      }));
    } else {
      this.items = [];
    }
  }

  // カート内容をセッションストレージに保存
  saveCartToSession() {
    sessionStorage.setItem(this.CART_SESSION_KEY, JSON.stringify(this.items));
  }

  getQuantityMin(): number {
    // デフォルトの最小値
    return 1;
  }

  getQuantityMax(): number {
    // デフォルトの最大値
    return 20;
  }

  removeItem(id: number) {
    this.items = this.items.filter((i) => i.cart_item_id !== id);
    // quantityMapからも削除
    delete this.quantityMap[id];
    this.saveCartToSession();
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  onProceedToCheckout() {
    const userId = this.userService.getUser().id;
    // ログインしていない場合はログイン画面に飛ばす
    if (userId == 0) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/purchase-confirm']);
  }
}
