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
}
