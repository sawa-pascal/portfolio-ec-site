import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

enum MoveType {
  NORMAL,
  UNDO,
  REDO,
}

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  private navigateHistory: string[] = [];
  private redoHistory: string[] = [];

  private moveType: MoveType = MoveType.NORMAL;

  constructor(private router: Router) {
    // サイトにアクセス時にトップページデータを記録する
    this.pushHistory('/');
  }

  toTopPage(searchValue: string | null = null) {
    if (searchValue == null) {
      this.pushHistory('/');
      this.router.navigate(['/']);
      return;
    }

    const trimmedName = searchValue?.trim() || '';
    this.pushHistory('/product-list?search=' + encodeURIComponent(trimmedName));
    this.router.navigate(['/product-list'], { queryParams: { search: trimmedName } });
  }

  toLogin() {
    this.pushHistory('/login');
    this.router.navigate(['/login']);
  }

  // ユーザーの登録画面とパスワードの表示画面には戻らなくていいので履歴に残さない
  toUserRegister() {
    this.router.navigate(['/user-register']);
  }

  toUserPassViewer() {
    this.router.navigate(['/user-pass-viewer']);
  }

  toProductDetail(product_id: number) {
    this.pushHistory('/product-detail:' + product_id);
    this.router.navigate(['/product-detail', product_id]);
  }

  toCart() {
    this.pushHistory('/cart');
    this.router.navigate(['/cart']);
  }

  toPurchaseConfirm() {
    this.pushHistory('/purchase-confirm');
    this.router.navigate(['/purchase-confirm']);
  }

  toPurchaseConfirmed() {
    this.pushHistory('/purchase-confirmed');
    this.router
      .navigate(['/purchase-confirmed'])
      .then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  toOrderList() {
    this.pushHistory('/order-list');
    this.router.navigate(['/order-list']);
  }

  toUserSetting() {
    this.pushHistory('/user-setting');
    this.router.navigate(['/user-setting']);
  }

  toChangePassword() {
    this.pushHistory('/change-password');
    this.router.navigate(['/change-password']);
  }

  /**
   * 一つ前のページに戻る（undo 相当）
   */
  toUndo() {
    if (this.navigateHistory.length < 2) {
      // 履歴がない or 1ページだけなら「戻る」不可
      return;
    }
    // 現在のページをredo履歴へ
    const current = this.navigateHistory.pop();
    if (current) {
      if (this.redoHistory.length == 0) {
        this.redoHistory.push(current);
      } else if (this.redoHistory[this.redoHistory.length - 1] != current) {
        this.redoHistory.push(current);
      }
    }
    // 1つ前の履歴が「今戻りたいページ」
    const prev = this.navigateHistory[this.navigateHistory.length - 1];
    if (prev) {
      console.log("redo : " + this.redoHistory);
      this.moveType = MoveType.UNDO;
      this.navigateToRouteString(prev);
    }
  }

  /**
   * 進む（redo 相当）
   */
  toRedo() {
    if (this.redoHistory.length === 0) {
      // 進める履歴なし
      return;
    }
    const next = this.redoHistory.pop();
    if (next) {
      this.moveType = MoveType.REDO;
      if (this.navigateHistory[this.navigateHistory.length - 1] != next) {
        this.navigateHistory.push(next);
      }
      this.navigateToRouteString(next);
    }
  }

  /**
   * ログイン済みなのにログインページに遷移してしまった場合に呼ぶ関数
   * moveType で遷移理由を判定し、履歴からいまのログインページを除外し、直前ページへの操作を再実行する
   */
  loggedInMove() {
    // 履歴が2つ以上なければ何もしない
    if (this.navigateHistory.length < 2) {
      return;
    }
    // 履歴の一番最後がログインページであれば、それを消して直前ページに戻る
    const current = this.navigateHistory[this.navigateHistory.length - 1];
    if (current === '/login') {
      this.navigateHistory.pop();
      // 再度、直前のmoveTypeを参照して遷移種別に応じて遷移する
      const prev = this.navigateHistory[this.navigateHistory.length - 1];
      if (prev) {
        switch (this.moveType) {
          case MoveType.UNDO:
            if (this.navigateHistory.length < 2) {
              // 履歴がない or 1ページだけなら「戻る」不可直前ページに単純遷移
              this.navigateToRouteString(prev);
              return;
            }
            this.toUndo();
            break;
          case MoveType.REDO:
            if (this.redoHistory.length === 0) {
              // 進める履歴なしの場合は直前ページに単純遷移
              this.navigateToRouteString(prev);
              return;
            }

            this.toRedo();
            break;
          default:
            // 通常遷移の場合は直前ページに単純遷移
            this.navigateToRouteString(prev);
            break;
        }
      }
    }
  }

  private pushHistory(route: string) {
    // ユーザーの登録画面とパスワードの表示画面を履歴に残さない影響で同じページの履歴が残ることがあるのでそれを防ぐ
    if (this.navigateHistory[this.navigateHistory.length - 1] != route) {
      this.navigateHistory.push(route);
    }

    // 新しい移動をしたらredo履歴はクリアする（戻った後、新規操作した場合の標準的な動き）
    this.redoHistory = [];

    this.moveType = MoveType.NORMAL;

    console.log(this.navigateHistory);
  }

  /**
   * 例: '/product-detail:3'や'/product-list?search=test'などを正規化的にroute遷移する
   */
  private navigateToRouteString(route: string) {
    // パラメータのパターンを判定し、適切に遷移
    // /product-detail:123
    const productDetailMatch = route.match(/^\/product-detail:(\d+)$/);
    if (productDetailMatch) {
      const productId = Number(productDetailMatch[1]);
      this.router.navigate(['/product-detail', productId]);
      return;
    }
    // /product-list?search=XXXX
    const productListMatch = route.match(/^\/product-list\?search=(.*)$/);
    if (productListMatch) {
      const searchVal = decodeURIComponent(productListMatch[1] || '');
      this.router.navigate(['/product-list'], { queryParams: { search: searchVal } });
      return;
    }
    // 普通のルート
    this.router.navigate([route]);

    console.log(this.navigateHistory);
  }
}
