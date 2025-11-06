import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SharedValueService } from '../../services/shared-value.service';
import { Item } from '../../models/items-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Item | null = null;
  quantity: number = 1;
  quantityOptions: number[] = [];
  CART_SESSION_KEY = 'cart_items';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private sharedValueService: SharedValueService,
    private router: Router,
  ) {}

  ngOnInit() {
    const min = this.getQuantityMin();
    const max = this.getQuantityMax();
    this.quantityOptions = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.productService.getProducts().subscribe({
          next: (res: any) => {
            const items: Item[] = res.items;
            this.product = items.find((item) => item.id == id) ?? null;
          },
        });
      }
    });
  }

  getQuantityMin(): number {
    // デフォルトの最小値
    return 1;
  }

  getQuantityMax(): number {
    // デフォルトの最大値
    return 20;
  }

  getImageUrl(product: Item): string {
    return this.sharedValueService.getImageUrl() + product.image_url;
  }

  addToCart() {
    if (!this.product) return;

    // セッションストレージで管理する
    const sessionStr = sessionStorage.getItem(this.CART_SESSION_KEY);
    let items: any[] = [];
    if (sessionStr) {
      items = JSON.parse(sessionStr);
    }

    // 既にカートに同じ商品があれば数量を加算する、それ以外は新規追加
    let existing = items.find((item: any) => item.id === this.product?.id);

    if (existing) {
      existing.quantity = Number(existing.quantity) + Number(this.quantity);
      // 数量上限適用
      if (existing.quantity > this.getQuantityMax()) {
        existing.quantity = this.getQuantityMax();
      }
      existing.subtotal = Number(existing.price) * existing.quantity;
    } else {
      const cart_item = {
        cart_item_id: new Date().getTime(), // 一意な値としてtimestamp
        id: this.product.id,
        name: this.product.name,
        price: Number(this.product.price),
        quantity: this.quantity,
        subtotal: Number(this.product.price) * this.quantity,
        image_url: this.product.image_url,
      };
      items.push(cart_item);
    }

    sessionStorage.setItem(this.CART_SESSION_KEY, JSON.stringify(items));
    // alert(`${this.product?.name} を ${this.quantity} 個カートに追加しました`);
    this.router.navigate(['./cart']);
  }
}
