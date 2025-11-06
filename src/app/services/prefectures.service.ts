import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedValueService } from './shared-value.service';
import { Prefecture } from '../models/prefectures-model';

@Injectable({
  providedIn: 'root',
})
export class PrefecturesService {
  getPrefectures(): Prefecture[] {
    return this.prefectures;
  }

  private prefectures: Prefecture[] = [];

  constructor(private http: HttpClient, private sharedValueService: SharedValueService) {
    this.requestGetPrefecturesList().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.prefectures = res.prefectures as Prefecture[];
        }
      },
      error: (res: any) => {
        console.log('requestGet失敗' + res.message);
      },
    });
  }

  convertPrefectureName(id: number): string {
    const prefecture = this.prefectures.find((_) => _.id == id);
    return prefecture == null ? '' : prefecture.name;
  }

  private requestGetPrefecturesList(id: number = 0): Observable<any> {
    return this.http.get(`${this.sharedValueService.getApiUrl()}get_prefectures_list.php?id=${id}`);
  }
}