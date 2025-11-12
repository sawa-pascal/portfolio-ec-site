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

  toPurchaseConfirm() {
    this.router.navigate(['/purchase-confirm']);
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
