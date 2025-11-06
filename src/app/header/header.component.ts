import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  itemName = new FormControl('');
  showDropdown = false;

  constructor(private userService: UserService, private router: Router) {}

  getUserName(): string {
    return this.userService.getUser().name;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  onClickedSearch(): void {
    const name = this.itemName.value?.trim() || '';
    this.router.navigate(['/product-list'], { queryParams: { search: name } });
  }

  signOut(event: Event): void {
    event.preventDefault();
    // サインアウト処理（ユーザ情報クリア）
    // 必要に応じて追加
    this.userService.resetUser();
    this.router.navigate(['/']);
    this.showDropdown = false;
  }

  onMenuChange($event: Event): void {
    const selectElement = $event.target as HTMLSelectElement;
    const value = selectElement.value;

    switch (value) {
      case 'order-list':
        this.router.navigate(['/order-list']);
        break;
      case 'user-setting':
        this.router.navigate(['/user-setting']);
        break;
      case 'change-password':
        this.router.navigate(['/change-password']);
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
}
