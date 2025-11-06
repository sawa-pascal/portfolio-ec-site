import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedValueService {
  private apiUrl = 'http://localhost/portfolio/api/';
  private imageUrl = 'http://localhost/portfolio/images/';
  private editImageUrl = 'http://localhost/portfolio/tmp_image/';
  // private apiUrl = '../api/';
  // private imageUrl = '../images/';
  // private editImageUrl = '../tmp_image/';

  getApiUrl(): string {
    return this.apiUrl;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getEditImageUrl(): string {
    return this.editImageUrl;
  }
}