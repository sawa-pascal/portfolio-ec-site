import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPassViewerComponent } from './user-pass-viewer.component';

describe('UserPassViewerComponent', () => {
  let component: UserPassViewerComponent;
  let fixture: ComponentFixture<UserPassViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPassViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPassViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
