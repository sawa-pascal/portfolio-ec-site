import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NavigateService } from '../services/navigate.service';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  pass: FormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  message: string = '';

  myForm: FormGroup = new FormGroup({
    email: this.email,
    pass: this.pass,
  });

  constructor(private userService: UserService, private navigateService: NavigateService) {
    if (this.userService.getUser().id == 0) return;

    // ログイン済みの場合
    this.navigateService.loggedInMove();
  }

  ngOnInit() {
    if (this.userService.getUser().id == 0) return;

    // ログイン済みの場合
    this.navigateService.loggedInMove();
  }

  onSubmit() {
    this.userService.loginWithResult(this.email.value, this.pass.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res);

          // ログインできたら前のページに飛ばす
          this.navigateService.toUndo();
        } else {
          console.log(res);
          this.message = res.message;
        }
      },
      error: () => {
        this.message = '通信エラー';
      },
    });
  }

  toUserRegister() {
    this.navigateService.toUserRegister();
  }

  toUserPassViewer() {
    this.navigateService.toUserPassViewer();
  }
}
