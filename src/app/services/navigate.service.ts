import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  constructor(private router: Router) {}

  toTopPage(searchValue: string | null = null) {
    if (searchValue == null) {
      this.router.navigate(['/']);
      return;
    }

    const trimmedName = searchValue?.trim() || '';
    this.router.navigate(['/product-list'], { queryParams: { search: trimmedName } });
  }

  toLogin() {
    this.router.navigate(['/login']);
  }

  toUserRegister() {
    this.router.navigate(['/user-register']);
  }

  toUserPassViewer() {
    this.router.navigate(['/user-pass-viewer']);
  }

  toProductDetail(product_id: number) {
    this.router.navigate(['/product-detail', product_id]);
  }

  toCart() {
    this.router.navigate(['/cart']);
  }

  toPurchaseConfirm() {
    this.router.navigate(['/purchase-confirm']);
  }

  toPurchaseConfirmed() {
    this.router
      .navigate(['/purchase-confirmed'])
      .then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  toOrderList() {
    this.router.navigate(['/order-list']);
  }

  toUserSetting() {
    this.router.navigate(['/user-setting']);
  }

  toChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
