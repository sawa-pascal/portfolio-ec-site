import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-change-password.component',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  currentPass: string = '';
  newPass: FormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  newPassConfirm: FormControl = new FormControl('');

  message: string = '';

  myForm: FormGroup = new FormGroup({
    newPass: this.newPass,
    newPassConfirm: this.newPassConfirm,
  });

  constructor(private userService: UserService) {}

  ngOnInit() {
    const user = this.userService.getUser();

    this.currentPass = user.hashed_password;
  }

  onSubmit() {
    // バリデーション: 都道府県ID取得できなければエラー
    if (this.newPass.value != this.newPassConfirm.value) {
      this.message = '確認用と新しく入力したパスワードが違います';
      return;
    }

    if (this.currentPass == this.newPass.value) {
      this.message = '現在のパスワードと同じです';
      return;
    }

    let user = this.userService.getUser();
    this.userService.requestChangePassword(user.id, this.newPass.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = 'パスワードを変更しました';

          user.hashed_password = this.currentPass = res.newPassword;
          this.userService.updateUser(user);
        } else {
          this.message = res.message || '変更に失敗しました';
        }
      },
      error: () => {
        this.message = '通信エラーが発生しました';
      },
    });
  }
}
