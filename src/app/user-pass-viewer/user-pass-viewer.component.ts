import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-pass-viewer.component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-pass-viewer.component.html',
  styleUrl: './user-pass-viewer.component.scss',
})
export class UserPassViewerComponent {
  password: string = '';
  message: string = '';
  isSuccess: boolean = false;

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);

  myForm: FormGroup = new FormGroup({
    email: this.email,
  });

  constructor(private userService: UserService) {}

  onSubmit() {
    this.userService.getUserPassword(this.email.value).subscribe((res) => {
      if (res.success) {
        this.password = res.password[0];
        this.isSuccess = true;
      } else {
        this.message = res.message;
        this.isSuccess = false;
      }
    });
  }
}
