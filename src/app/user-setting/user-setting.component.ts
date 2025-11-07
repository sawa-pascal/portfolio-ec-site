import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PrefecturesService } from '../services/prefectures.service';
import { Prefecture } from '../models/prefectures-model';

@Component({
  selector: 'app-user-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './user-setting.component.html',
  styleUrl: './user-setting.component.scss',
})
export class UserSettingComponent implements OnInit {
  name: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  tel: FormControl = new FormControl('', Validators.required);
  prefecturesDropDown: FormControl = new FormControl('', Validators.required);
  address: FormControl = new FormControl('', Validators.required);

  message: string = '';

  myForm: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    tel: this.tel,
    prefecturesDropDown: this.prefecturesDropDown,
    address: this.address,
  });
  constructor(
    private userService: UserService,
    private prefecturesService: PrefecturesService
  ) {}

  ngOnInit() {
    const user = this.userService.getUser();

    this.name.setValue(user.name);
    this.email.setValue(user.email);
    this.tel.setValue(user.tel);
    console.log(user.prefecture_id);
    this.prefecturesDropDown.setValue(
      this.prefecturesService.convertPrefectureName(Number(user.prefecture_id))
    );
    console.log(this.prefecturesDropDown.value);

    this.address.setValue(user.address);
  }

  onSubmit() {
    const prefecture_id = this.prefecturesService
      .getPrefectures()
      .find((_) => _.name == this.prefecturesDropDown.value)?.id;

    // バリデーション: 都道府県ID取得できなければエラー
    if (!prefecture_id) {
      this.message = '都道府県の選択が必要です';
      return;
    }

    // ユーザー情報を更新
    const user = this.userService.getUser();
    const updateUser = {
      id: user.id,
      name: this.name.value,
      email: this.email.value,
      tel: this.tel.value,
      hashed_password: user.hashed_password,
      prefecture_id: prefecture_id,
      address: this.address.value,
    };

    this.userService.requestUpdateUser(updateUser).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = 'ユーザー情報を更新しました';

          this.userService.updateUser(updateUser);
        } else {
          this.message = res.message || '更新に失敗しました';
        }
      },
      error: () => {
        this.message = '通信エラーが発生しました';
      },
    });
  }

  getPrefectures(): Prefecture[] {
    return this.prefecturesService.getPrefectures();
  }
}
