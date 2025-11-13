import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedValueService } from '../services/shared-value.service';
import { NavigateService } from '../services/navigate.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  itemName = new FormControl('');

  showDropdown = false;

  constructor(
    private userService: UserService,
    private navigateService: NavigateService,
    private sharedValueService: SharedValueService
  ) {
    this.itemName.valueChanges.subscribe((value) => {
      this.sharedValueService.setSearchItemStr(value ?? '');
    });
  }

  getUserName(): string {
    return this.userService.getUser().name;
  }

  login(): void {
    this.navigateService.toLogin();
  }

  onClickedSearch(): void {
    this.navigateService.toTopPage(this.itemName.value);
  }

  signOut(event: Event): void {
    event.preventDefault();
    // サインアウト処理（ユーザ情報クリア）
    // 必要に応じて追加
    this.userService.resetUser();
    this.onClickedSearch();
    this.showDropdown = false;
  }

  onMenuChange($event: Event): void {
    const selectElement = $event.target as HTMLSelectElement;
    const value = selectElement.value;

    switch (value) {
      case 'order-list':
        this.navigateService.toOrderList();
        break;
      case 'user-setting':
        this.navigateService.toUserSetting();
        break;
      case 'change-password':
        this.navigateService.toChangePassword();
        break;
      case 'sign-out':
        this.signOut($event);
        break;
      default:
        // 選択肢が空か、予期しない値
        break;
    }

    // select の値をクリアして、再度メニューを選択できるようにする
    selectElement.selectedIndex = 0;
  }

  goTopPage() {
    this.navigateService.toTopPage();
  }

  toCart() {
    this.navigateService.toCart();
  }
}
