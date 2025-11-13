import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SharedValueService } from '../services/shared-value.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { NavigateService } from '../services/navigate.service';

@Component({
  selector: 'app-cart',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  items: any[] = [];
  quantityMap: { [itemId: number]: FormControl } = {};
  quantityOptions: { [itemId: number]: number[] } = {};
  total = 0;

  // セッションストレージのキー
  CART_SESSION_KEY = 'cart_items';

  constructor(
    private userService: UserService,
    private navigateService: NavigateService,
    private sharedValueService: SharedValueService,
  ) {}

  ngOnInit() {
    // セッションからカート情報を取得
    this.loadCartFromSession();

    // 各商品の最大数量分の選択肢を作成（商品ごとに異なる在庫考慮）
    this.items.forEach((item) => {
      console.log(item);
      // 商品ごとの最大選択可能数: 在庫が20未満なら在庫まで、20超の場合は20まで
      const min = this.getQuantityMin();
      const max = Math.min(Number(item.stock), this.getQuantityMax());
      this.quantityOptions[item.cart_item_id] = Array.from(
        { length: max - min + 1 },
        (_, i) => i + min
      );

      this.quantityMap[item.cart_item_id] = new FormControl(Number(item.quantity));

      // valueChangesの購読（数量が変更されたとき、セッションに反映・バリデーションも）
      this.quantityMap[item.cart_item_id].valueChanges.subscribe((value: number) => {
        if (value == null) {
          return;
        }
        const itemMin = this.getQuantityMin();
        // 再取得（在庫変動の可能性に備える）: 最大は今のstock, 20の小さい方
        const itemMax = Math.min(Number(item.stock), this.getQuantityMax());

        if (value < itemMin) {
          this.quantityMap[item.cart_item_id].setValue(itemMin, { emitEvent: false });
          return;
        }
        if (value > itemMax) {
          this.quantityMap[item.cart_item_id].setValue(itemMax, { emitEvent: false });
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
        stock: Number(item.stock),
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
    delete this.quantityOptions[id];
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
      this.navigateService.toLogin();
      return;
    }

    this.navigateService.toPurchaseConfirm();
  }

  returnTop() {
    this.navigateService.toTopPage(this.sharedValueService.getSearchItemStr());
  }
}
