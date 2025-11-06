import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  pass: FormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);

  message: string = '';

  constructor(private userService: UserService, private router: Router) {}

  myForm: FormGroup = new FormGroup({
    email: this.email,
    pass: this.pass,
  });

  onSubmit() {
    this.userService.loginWithResult(this.email.value, this.pass.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log(res);

          // ログインできたら最初のページに飛ばす
          this.router.navigate(['']);
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
}
