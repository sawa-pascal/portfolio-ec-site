import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';
import { SharedValueService } from './shared-value.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // userId = 0; として未ログイン時に0で管理。
  private user: User = {
    id: 0,
    name: '',
    email: '',
    hashed_password: '',
    tel: '',
    prefecture_id: 0,
    address: '',
  };

  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {}

  registerUser(
    name: string,
    email: string,
    tel: string,
    prefecture_id: number,
    address: string,
    password: string
  ): Observable<any> {
    return this.http.post(`${this.sharedValueService.getApiUrl()}/add_user.php`, {
      name: name,
      email: email,
      tel: tel,
      prefecture_id: prefecture_id,
      address: address,
      password: password,
    });
  }

  getUser(): User {
    return this.user;
  }

  resetUser() {
    this.user = {
      id: 0,
      name: '',
      email: '',
      hashed_password: '',
      tel: '',
      prefecture_id: 0,
      address: '',
    };
  }

  /**
   * ログイン時に { success: boolean, message: string } を返す
   */
  loginWithResult(
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string }> {
    return new Observable<{ success: boolean; message: string }>((observer) => {
      this.fetchUser(email, password).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.user = res.user as User;
            console.log(this.user);
            console.log(this.user.name);
            observer.next({ success: true, message: 'ログイン成功' });
          } else {
            observer.next({ success: false, message: res.message || '認証失敗' });
          }
          observer.complete();
        },
        error: () => {
          observer.next({ success: false, message: '通信エラー' });
          observer.complete();
        },
      });
    });
  }

  getUserPassword(email: string): Observable<any> {
    return this.http.get(
      `${this.sharedValueService.getApiUrl()}/get_user_password.php?email=${email}`
    );
  }

  private fetchUser(email: string, password: string): Observable<any> {
    return this.http.get(
      `${this.sharedValueService.getApiUrl()}/get_user.php?email=${email}&password=${password}`
    );
  }

  requestUpdateUser(user: User): Observable<any> {
    return this.http.post(
      `${this.sharedValueService.getApiUrl()}/update_user.php`,
      user
    );
  }
}
