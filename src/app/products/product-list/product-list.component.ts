import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedValueService } from '../../services/shared-value.service';
import { Item } from '../../models/items-model';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/categories-model';
import { CurrencyPipe } from '@angular/common';
import { NavigateService } from '../../services/navigate.service';

@Component({
  selector: 'app-product-list',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  viewProducts: Item[] = [];

  private products: Item[] = [];
  private searchKeyword: string = '';

  constructor(
    private productService: ProductService,
    private navigateService: NavigateService,
    private sharedValueService: SharedValueService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // クエリパラメータの取得と監視
    this.route.queryParamMap.subscribe((params) => {
      this.searchKeyword = (params.get('search') || '').trim().toLowerCase();

      this.productService.getProducts().subscribe({
        next: (res: any) => {
          this.products = (res.items as any[]).map((i) => ({
            ...(i as Item),
            stock: i.quantity,
          }));
          // 検索キーワードによるあいまい検索
          if (this.searchKeyword) {
            // 名前 または 説明文 に含まれる（大文字小文字区別なし）
            this.viewProducts = this.products.filter((item) => {
              const name = (item.name || '').toLowerCase();
              return name.includes(this.searchKeyword);
            });
          } else {
            this.viewProducts = [...this.products];
          }
        },
      });
    });
  }

  getImageUrl(product: any) {
    return this.sharedValueService.getImageUrl() + product.image_url;
  }

  getCategories(): Category[] {
    return this.categoriesService.getCategories();
  }

  getProductsByCategory(category_id: number): Item[] {
    return this.viewProducts.filter((_) => _.category_id == category_id);
  }

  goToProductDetail(product_id: number) {
    this.navigateService.toProductDetail(product_id);
  }
}
