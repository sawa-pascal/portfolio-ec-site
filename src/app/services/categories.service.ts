import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';
import { Category } from '../models/categories-model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categories: Category[] = [];

  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {
    this.updateCategories();
  }

  requestGetCategoriesList(id: number = 0): Observable<any> {
    return this.http.get(
      `${this.sharedValueService.getApiUrl()}categories/get_categories_list.php?id=${id}`
    );
  }

  updateCategories() {
    this.requestGetCategoriesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.categories = res.items as Category[];
        }
      },
      error: () => {
        console.log('requestGet失敗');
      },
    });
  }

  getCategories(): Category[] {
    return this.categories;
  }

  convertCategoryName(id: number): string {
    const category = this.categories.find((_) => _.id == id);
    return category == null ? '' : category.name;
  }
}
