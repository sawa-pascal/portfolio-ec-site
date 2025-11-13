import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { PrefecturesService } from '../services/prefectures.service';
import { Prefecture } from '../models/prefectures-model';
import { NavigateService } from '../services/navigate.service';
@Component({
  selector: 'app-user-register.component',
  imports: [ReactiveFormsModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss',
})
export class UserRegisterComponent {
  name: FormControl = new FormControl('', Validators.required);
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  pass: FormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  tel: FormControl = new FormControl('', Validators.required);
  prefecturesDropDown: FormControl = new FormControl('', Validators.required);
  address: FormControl = new FormControl('', Validators.required);

  message: string = '';

  constructor(
    private userService: UserService,
    private navigateService: NavigateService,
    private prefecturesService: PrefecturesService
  ) {}
  myForm: FormGroup = new FormGroup({
    name: this.name,
    email: this.email,
    pass: this.pass,
    tel: this.tel,
    prefecturesDropDown: this.prefecturesDropDown,
    address: this.address,
  });

  onSubmit() {
    const prefecture_id = this.prefecturesService
      .getPrefectures()
      .find((_) => _.name == this.prefecturesDropDown.value)?.id;

    this.userService
      .registerUser(
        this.name.value,
        this.email.value,
        this.tel.value,
        Number(prefecture_id),
        this.address.value,
        this.pass.value
      )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.navigateService.toLogin();
          } else {
            this.message = res.message;
          }
        },
        error: (res: any) => {
          console.log(res);
          this.message = '通信エラー';
        },
      });
  }

  getPrefectures(): Prefecture[] {
    return this.prefecturesService.getPrefectures();
  }
}
