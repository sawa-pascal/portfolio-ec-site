import { Routes } from '@angular/router';

import { Page404Component } from './page404/page404.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UserPassViewerComponent } from './user-pass-viewer/user-pass-viewer.component';

// 商品
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';

// 購入
import { PurchaseConfirmComponent } from './purchase/purchase-confirm/purchase-confirm.component';
import { PurchaseConfirmedComponent } from './purchase/purchase-confirmed/purchase-confirmed.component';

import { OrderListComponent } from './order-list/order-list.component';
import { UserSettingComponent } from './user-setting/user-setting.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full' },

  // 商品
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },

  // 購入
  { path: 'purchase-confirm', component: PurchaseConfirmComponent },
  { path: 'purchase-confirmed', component: PurchaseConfirmedComponent },

  { path: 'order-list', component: OrderListComponent },
  { path: 'user-setting', component: UserSettingComponent },
  { path: 'change-password', component: ChangePasswordComponent },

  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'user-pass-viewer', component: UserPassViewerComponent },
  { path: '**', component: Page404Component },
];
